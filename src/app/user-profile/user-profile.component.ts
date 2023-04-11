import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { GroupService } from '../shared/group.service';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userDetails: any;
  showSpinner = false;
  serverErrorMessages: string | undefined;
  showSucessMessage: string | undefined;
  disabled = false;

  constructor(public userService: UserService, private groupService: GroupService, private router: Router) { }

  ngOnInit() {
    this.getUser();
  }

  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
    this.groupService.deleteGroupIds();
  }
  onSubmit(form: NgForm) {
    this.showSpinner = true;
    this.disabled = true;
    this.userService.editUserProfile(form.value).subscribe({
      next: (res: any) => {
        this.getUser();
        this.showSucessMessage = res['message'];
        this.resetForm(form);
        this.showSpinner = false;
        this.disabled = false;
      },
      error: (err) => {
        this.serverErrorMessages = err.error['error'];
        this.showSpinner = false;
        this.disabled = false;
      },
    });
  }

  // reset the form when after submit is clicked
  resetForm(form: NgForm) {

    this.userService.model = {
      fullName: null,
      password: null,
      confirmPassword: null
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

  getUser() {
    this.showSpinner = true;
    this.userService.getUserProfile().subscribe({
      next: (res: any) => {
        this.userDetails = res['user'];
        this.showSpinner = false;
      },
      error: (err) => {
        console.log(err);
        this.showSpinner = false;
      },
    });
  }

}
