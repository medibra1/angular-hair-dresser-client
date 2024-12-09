import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';
import { ProfileService } from '../profile/profile.service';
import { ToastService } from '../toast/toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  // private userProfileKey = 'user_profile';
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  private api = inject(ApiService);
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  
  async signup(data: FormData) {
    try {
      const response = await lastValueFrom(
        this.api.post('user/register', data, true)
      );
      console.log('user signed up:', response);
      this.storeToken(response.data.token);
      this.updateProfileData(response.data.user);
      this.authStatus.next(true);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const data = {
        email,
        password,
      };
      const response = await lastValueFrom(this.api.post('user/login', data));
      console.log('user logged in :', response);
      this.storeToken(response.data.token);
      this.updateProfileData(response.data.user);
      this.authStatus.next(true);
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async sendResetPasswordOtp(email: string) {
    try {
      const data = { email };
      const response = await lastValueFrom(this.api.patch('user/send/reset/password/token', data));
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async verifyResetPasswordOtp(email: string, otp: string) {
    try {
      const data = { 
        email,
        otp: otp 
      };
      const response = await lastValueFrom(this.api.patch('user/verify/resetPasswordToken', data));
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async resetPassword(data) {
    try {
      const reset_pwd_data = {
        email: data.email,
        password: data.new_password
      }
      const response = await lastValueFrom(this.api.patch('user/reset/password', reset_pwd_data));
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  hasCartItems(): boolean {
    const cart = localStorage.getItem('cart');
    return cart && JSON.parse(cart).length > 0;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  updateProfileData(data) {
    this.profileService.updateProfileData(data);
  }

  async sendOtp(email: string) {
    try {
      const data = { email };
      const response = await lastValueFrom(this.api.patch('user/send/reset/password/token', data));
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      const data = { 
        email,
        otp: otp 
      };
      const response = await lastValueFrom(this.api.patch('user/verify/resetPasswordToken', data));
      console.log(response);
      this.updateProfileData(response.user);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  logoutUser(msg?) {
    if (this.isAuthenticated()) {
      localStorage.removeItem(this.tokenKey);
      // localStorage.removeItem(this.userProfileKey);
      this.authStatus.next(false);
      this.profileService.updateProfileData(null);
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      // error?.error ? alert(error?.error.message) : 'Please Login Again';
      this.showToast(
        msg ? msg : 'Something went wront. Please Log in Again',
        'error'
      );
    }
  }

  async logout() {
    try {
      await lastValueFrom(this.api.get('logout'));
      this.logoutUser('You Logged Out!');
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async autoLoginGuard(): Promise<boolean> {
    try {
      if (this.isAuthenticated()) {
        // this.router.navigateByUrl('/products', { replaceUrl: true });
        if (this.hasCartItems()) this.router.navigateByUrl('/cart', { replaceUrl: true });
        else this.router.navigateByUrl('/products', { replaceUrl: true });
        return false;
      }
      return true;
    } catch (e) {
      console.log(e);
      return true;
    }
  }

  async authGuard(): Promise<Boolean> {
    console.log('isAuthenticated: ', this.isAuthenticated());
    if (this.isAuthenticated()) {
      // if (!this.currentUserSubject.value) {
      //   this.getUserProfile();
      // }
      return true;
    }
    console.log('n est pas authentifié');
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
    return false;
  }

  showToast(msg, type) {
    this.toastService.showToast({
      message: msg,
      type: type,
      duration: 5000,
      position: 'top',
    });
  }
}
