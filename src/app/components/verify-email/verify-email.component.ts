import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Modal2Component } from '../modal2/modal2.component';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';
import { OtpInputComponent } from '../otp-input/otp-input.component';
import { CommonModule } from '@angular/common';
import { CountdownService } from '../../services/countdown/countdown.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, Modal2Component, OtpInputComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {

  @Input() email;
  // displayVerifyEmailModal = false;
  @Output() closeModalClicked = new EventEmitter<any>();

  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  countdownService = inject(CountdownService);

  otp: string;
  length: number;
  disabledVerifyBtn = true;

  ngOnInit() {
    // this.checkCooldown();
    this.countdownService.checkCooldown();
    console.log('EMAIL TO VERY: ', this.email);
    this.sendOtp();
  }


  getOtpLength(length) {
    this.length = length;
  }

  onOtpChange(otp) {
    this.otp = otp;
    console.log(this.otp);
    if(this.otp?.length == this.length) this.disabledVerifyBtn = false;
    else this.disabledVerifyBtn = true;
  }

  sendOtp() {
    // this.displayVerifyEmailModal = true;
    console.log('Remaining time: ', this.countdownService.timeRemaining);
    // if (this.timeRemaining > 0) return;
    if (this.countdownService.timeRemaining > 0) return;


    this.authService.sendOtp(this.email).then(data => {
      console.log(data);
    // Save the current timestamp to localStorage
    localStorage.setItem('lastOtpTimestamp', Date.now().toString());
    // Start the countdown
    this.countdownService.startCountdown(this.countdownService.cooldownPeriod);
      this.showToast('An Otp has been sent to your email address.', 'success');
    })
    .catch(e => {
      console.log(e);
      // let msg = 'Something went wrong, please try again';
      this.showToast(e.error.message ? e.error.message : 'Something went wrong, please try again', 'error');
    });
  }

  handleVerifyEmail() {
    this.authService.verifyOtp(this.email, this.otp).then(data => {
      console.log(data);
      // this.displayVerifyEmailModal = false;
      this.closeModal();
      // this.errorMessage = [];
      // this.successMessage = 'Your email address has been succesfully verified.';
      this.showToast('Your email address has been succesfully verified.', 'success');
    })
    .catch(e => {
      console.log(e);
      this.showToast(e.error.message ? e.error.message : 'Something went wrong, please try again', 'error');
    }); 
  }

  closeModal() {
  //  this.displayVerifyEmailModal = false;
    this.closeModalClicked.emit();
  }

  showToast(msg, type, duration = 5000) {
    this.toastService.showToast({
      message: msg,
      type: type,
      duration: duration,
      position: 'top',
    });
  }

  ngOnDestroy() {
    this.countdownService.timeRemaining = 0
  }

}
