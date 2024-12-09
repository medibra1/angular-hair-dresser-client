import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error-msg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error-msg.component.html',
  styleUrl: './form-error-msg.component.css'
})
export class FormErrorMsgComponent {

  @Input() control: AbstractControl;

  error_messages!: Array<{
    type: string,
    message: string
  }>

  ngOnInit() {
      this.error_messages = [
        { type: 'required', message: 'Required field.' },
        {
          type: 'minlength',
          message: ' characters minimum required.',
        },
        {
          type: 'maxlength',
          message: ' characters maximum',
        },
        { type: 'email', message: 'The email format is invalid.' },
        { type: 'invalidNumber', message: "Enter only number." },
        { type: 'invalidEmail', message: 'The email format is invalid.' },
        {
          type: 'invalidUrl',
          message:
            'Invalid URL. The URL must start with http, https, or www. and end by .xx',
        },
        // { type: 'notMatching', message: "Passwords do not match." },
        { type: 'noMatchingPassword', message: "Passwords do not match." },
        {
          type: 'passwordMismatch',
          message: 'New password cannot be the same as the current password',
        },
        {
          type: 'invalidPrice',
          message: 'Prie must be a valid integer or decimal',
        },
        {
          type: 'fileSizeExceeded',
          message: 'MB maximum allowed for the file',
        },
        {
          type: 'invalidFileType',
          message: ' are only allowed.',
        },
      ];
    
  }

  

  // ngOnChanges(): void {
  //   this.error_messages = [
  //     { type: 'required', message: 'Required field.' },
  //     {
  //       type: 'minlength',
  //       message: ' minimum characters required.',
  //     },
  //     {
  //       type: 'maxlength',
  //       message:  " caractères au maximum depassé(s).",
  //     },
  //     { type: 'email', message: "The email format is invalid." },
  //   ];
  // }

}
