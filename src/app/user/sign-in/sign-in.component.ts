import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) { }

  model = {
    email: '',
    password: '',
  };
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  serverErrorMessages: string | undefined;
  showSpinner = false;
  disabled = false;

  ngOnInit() {
    if (this.userService.isLoggedIn())
      this.router.navigateByUrl('/userprofile');
  }

  onSubmit(form: NgForm) {
    this.showSpinner = true;
    this.disabled = true;
    this.userService.login(form.value).subscribe({
      next: (res: any) => {
        this.userService.setToken(res['token']);
        this.router.navigateByUrl('/userprofile');
        this.showSpinner = false;
        this.disabled = false;
      },
      error: (err) => {
        console.log('error comes here');
        this.serverErrorMessages = err.error.message;
        this.showSpinner = false;
        this.disabled = false;
      },
    });
  }
}
