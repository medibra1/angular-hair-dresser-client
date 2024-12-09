import { Component, inject } from '@angular/core';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile/profile.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Modal2Component } from '../../components/modal2/modal2.component';
import { OtpInputComponent } from '../../components/otp-input/otp-input.component';

import { AlertComponent } from '../../components/alert/alert.component';
import { VerifyEmailComponent } from '../../components/verify-email/verify-email.component';
import { UpdatePasswordFormComponent } from '../../components/update-password-form/update-password-form.component';
import { ProfileFormComponent } from '../../components/profile-form/profile-form/profile-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Modal2Component, AlertComponent, VerifyEmailComponent, UpdatePasswordFormComponent, ProfileFormComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  otp: string;
  length: number;
  verifyOtp = false;

  profile = {} as User;
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  // toastService = inject(ToastService);
  profileSub: Subscription;

  displayVerifyEmailModal = false;
  displayUpdateProfileModal = false;
  displayUpdatePwdModal = false;

  successMessage = '';
  errorMessage: any[] = [];

  constructor() {}

  async ngOnInit() {
    // await this.profileService.getProfile();
    this.profileSub = this.profileService.profile.subscribe({
      next: (profile) => {
        this.profile = profile;
        console.log('Profile data Profile - component: ', this.profile);
        if(this.profile && !this.profile?.email_verified) {
          this.errorMessage = ['Your email address is not verified.'];
        }
      },
    });

    // this.initializeForm();
  }

  closeVerifyEmailModal() {
    this.displayVerifyEmailModal = false;
  }

  closeModal(event?: any): void {
    console.log('Close Modal reponse: ', event);
      if(event) {
      if(event.status == true) this.successMessage = event.message;
      else this.errorMessage = [event.message];
    }
      this.displayUpdateProfileModal = false;
      this.displayUpdatePwdModal = false
  }

  // showToast(msg, type, duration = 5000) {
  //   this.toastService.showToast({
  //     message: msg,
  //     type: type,
  //     duration: duration,
  //     position: 'top',
  //   });
  // }

  async logout() {
    await this.authService.logout();
  }

  ngOnDestroy() {
    if (this.profileSub) this.profileSub.unsubscribe();
  }

}
