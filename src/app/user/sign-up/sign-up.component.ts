import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { UserService } from '../../shared/user.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean | undefined;
  serverErrorMessages: string | undefined;

  constructor(public userService: UserService) { }
  showSpinner = false;
  disabled = false;

  ngOnInit() { }

  onSubmit(form: NgForm) {
    this.showSpinner = true;
    this.disabled = true;
    this.userService.postUser(form.value).subscribe({
      next: (res) => {
        this.showSucessMessage = true;
        setTimeout(() => (this.showSucessMessage = false), 4000);
        this.resetForm(form);
        this.showSpinner = false;
        this.disabled = false;
      },
      error: (err) => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        } else
          this.serverErrorMessages =
            'Something went wrong.Please contact admin.';
        this.showSpinner = false;
        this.disabled = false;


      },
    });
  }

  // reset the form when after submit is clicked
  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      fullName: '',
      email: '',
      password: '',
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }
}
