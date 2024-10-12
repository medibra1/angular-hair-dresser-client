import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormErrorMsgComponent } from '../../../components/form-error-msg/form-error-msg.component';


// export const passwordMatchingValidator: ValidatorFn = (
//   control: AbstractControl): ValidationErrors | null => {
//   const password = control.get('password');
//   const confirmPassword = control.get('confirmPassword');
//   return password?.value === confirmPassword?.value
//     ? null
//     : { pwdNotMatched: 'Passwords do not match.' };
// };

function passwordMatchingValidator(formGroup: FormGroup) {
  const password = formGroup.get('password').value;
  const confirmPassword = formGroup.get('confirmPassword').value;
  if (password !== confirmPassword) {
    formGroup.get('confirmPassword').setErrors({ notMatching: true });
  } else {
    return null;
  }
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormErrorMsgComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  submitted = false;
  fieldTextType = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', [  Validators.required, Validators.minLength(3),Validators.maxLength(50),]],
      email: ['', [Validators.email, Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      phone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(9), Validators.maxLength(10)]],
      address: ['', [Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    },
    { validator: passwordMatchingValidator }
    );
  }

  // Getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    return;
    this.submitted = true;

    // Stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.authService.signup(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  togglePasswordInputType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
