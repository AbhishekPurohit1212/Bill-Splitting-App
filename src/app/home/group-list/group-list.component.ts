import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../shared/group.service';
import { UserService } from '../../shared/user.service';
import { UserGroupService } from '../../shared/user-group.service';
import { Router } from '@angular/router';
import { faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
})
export class GroupListComponent implements OnInit {
  colours: Array<any> = ['primary', 'success'];
  groupList: any = [];
  serverErrorMessages1: string | undefined;
  showSucessMessage1: string | undefined;
  serverErrorMessages2: string | undefined;
  showSucessMessage2: string | undefined;
  faUsers = faUsers; // fav icon
  faUser = faUser; // fav icon
  showSpinner = false;
  constructor(public groupService: GroupService, public userService: UserService, public userGroupService: UserGroupService) { }
  ngOnInit() {
    this.getGroupList();
  }
  onSubmitCreateForm(form: NgForm) {
    this.showSpinner = true;
    this.groupService.createGroup(form.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getGroupList();
        this.showSucessMessage1 = "Successfully created";
        this.resetFormCreate(form);
        this.showSpinner = false;
      },
      error: (err) => {
        this.serverErrorMessages1 = err.error['error'];
        this.showSpinner = false;
      },
    });

  }
  onSubmitSearchForm(form: NgForm) {
    this.showSpinner = true;
    this.userGroupService.creatUserGroup(form.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getGroupList();
        this.showSucessMessage2 = "Successfully added";
        this.resetFormSearch(form);
        this.showSpinner = false;
      },
      error: (err) => {
        this.serverErrorMessages2 = err.error['error'];
        this.showSpinner = false;
      },
    });

  }
  // reset the form when after submit is clicked
  resetFormCreate(form: NgForm) {
    this.groupService.name1 = undefined;
    form.resetForm();
    this.serverErrorMessages1 = '';
  }
  resetFormSearch(form: NgForm) {
    this.groupService.name2 = undefined;
    form.resetForm();
    this.serverErrorMessages2 = '';
  }

  getGroupList() {
    this.showSpinner = true;
    this.userService.getGroups().subscribe({
      next: (res: any) => {
        this.groupList = res;
        this.groupService.setGroupIds(this.groupList);
        this.showSpinner = false;
      },
      error: (err) => {
        console.log(err);
        this.showSpinner = false;
      },
    });
  }
}
