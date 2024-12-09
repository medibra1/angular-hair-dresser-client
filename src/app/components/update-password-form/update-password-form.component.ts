import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { emailValidator, passwordMismatchValidator } from '../../services/global/custom-validators';
import { FormErrorMsgComponent } from '../form-error-msg/form-error-msg.component';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile/profile.service';
import { filter, take } from 'rxjs';
import { User } from '../../models/user.model';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-update-password-form',
  standalone: true,
  imports: [CommonModule, FormErrorMsgComponent, ReactiveFormsModule],
  templateUrl: './update-password-form.component.html',
  styleUrl: './update-password-form.component.css'
})
export class UpdatePasswordFormComponent {

  // @Input() profileService: ProfileService;
  profileService = inject(ProfileService);
  @Output() updatePasswordReponse = new EventEmitter<{}>();

  updatePwdForm: FormGroup;
  fieldTextType = false;
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  profile: User;

  constructor() {
    this.updatePwdForm = this.formBuilder.group({
      email: ['', [emailValidator(), Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(150), 
      ]],
    },
    { validators: passwordMismatchValidator('password', 'new_password') }
  );
  }

  ngOnInit() {
    this.getProfile();
  }

  get f() {
    return this.updatePwdForm.controls;
  }

  async updatePassword() { 
    if (this.updatePwdForm.valid) {
      if(this.profile.email != this.f['email']?.value) {
        this.showToast('You can not update password for this email address !', 'error');
        return;
      }
      console.log('Profile form value: ', this.updatePwdForm.value);
      if(this.updatePwdForm.dirty) {
        try {
          const data = {
            email: this.f['email']?.value,
            password: this.f['password']?.value,
            new_password: this.f['new_password']?.value,
          };
          const response = await this.profileService.updatePassword(data);
          console.log('Update password: ', response);
          this.authService.logoutUser('Password edited successfully. Please log In With Your New Password!')
          // this.updatePasswordReponse.emit({
          //   status: true,
          //   message: 'Password edited successfully'
          // });
        } catch (e: any) {
          this.updatePasswordReponse.emit({
            status: false,
            message: e?.error ? e.error.message : 'Smothing went wrong. please try again!'
          });
          console.log('Password update error: ', e.error.message);
          throw(e);
        }
      }
    } else {
      this.validateAllFormFields(this.updatePwdForm);
    }
  }

  async getProfile() {
    // await this.profileService.getProfile();
    this.profileService.profile
    .pipe(
      filter(profile => Object.keys(profile).length > 0), // Filtrer les objets non vides
      take(1)
    )
    .subscribe({
      next: (profile) => {
        this.profile = profile;
        console.log('profile data update password form - component: ', this.profile);
      },
    });
  }

  togglePasswordInputType() {
    this.fieldTextType = !this.fieldTextType;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  showToast(msg, type) {
    this.toastService.showToast({
      message: msg,
      type: type,
      duration: 7000,
      position: 'top',
    });
  }

}
