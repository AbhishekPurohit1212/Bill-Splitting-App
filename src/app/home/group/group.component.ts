import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../shared/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlusSquare, faReceipt, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { UserGroupService } from '../../shared/user-group.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TransactionService } from '../../shared/transaction.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  constructor(public groupService: GroupService, private router: Router, public userGroupService: UserGroupService, public transactionService: TransactionService, private route: ActivatedRoute) { }
  groupDetails: any | undefined;
  allUserDetails: any | undefined;
  showSpinner = false;
  faPlusSquare = faPlusSquare;
  faReceipt = faReceipt;
  faUser = faUser
  serverErrorMessages: string | undefined;
  showSucessMessage: string | undefined;
  userDropdownList = [];
  selectedUser = [];
  userDropdownSettings: IDropdownSettings = {};
  payeeDropdownList: any;
  selectedPayee = [];
  payeeDropdownSettings: IDropdownSettings = {};
  showUserList = true;
  showAddPayee = true;
  hideAddPayee = false;
  showPayee = false;
  showPayeeList = true;
  tempPayeeList = [{ "_id": "defaultId", "fullName": "you" }];
  userNames = new Array();
  payeeNames = new Array();
  date: any | undefined;
  addMultiplePayeeAmount = false;
  ngOnInit(): void {
    this.showSpinner = true;
    const groupId = this.route.snapshot.paramMap.get('id')
    if (!this.groupService.isAdded(groupId)) {
      this.showSpinner = false;
      this.router.navigateByUrl('/home');
    }
    else {
      this.groupService.getGroup(groupId).subscribe({
        next: (res: any) => {
          this.groupDetails = res;
          console.log(res)
          this.userGroupService.getAllUsers(groupId).subscribe({
            next: (res: any) => {
              this.date = new Date();
              this.transactionService.selectedUsers.groupId = String(groupId);
              this.date = this.date.toLocaleString('en-US', {
                weekday: 'short', // long, short, narrow
                day: 'numeric', // numeric, 2-digit
                year: 'numeric', // numeric, 2-digit
                month: 'long', // numeric, 2-digit, long, short, narrow
              })
              this.allUserDetails = res;
              this.userDropdownList = this.allUserDetails;
              this.userDropdownSettings = {
                singleSelection: false,
                idField: '_id',
                textField: 'fullName',
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 3,
                allowSearchFilter: true
              };
              this.payeeDropdownList = this.allUserDetails;
              this.payeeDropdownSettings = {
                singleSelection: false,
                idField: '_id',
                textField: 'fullName',
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 3,
                allowSearchFilter: true
              };
            },
            error: (err) => {
            },
          })
          this.showSpinner = false;
        },
        error: (err) => {
          this.showSpinner = false;
          this.router.navigateByUrl('/home');
        },
      });
    }

  }
  onSubmitCreateForm(form: NgForm) {
    this.showSpinner = true;
    console.log(this.transactionService.selectedUsers);
    this.showSucessMessage = '';
    this.serverErrorMessages = '';
    if (this.transactionService.selectedUsers.splitEqually) {
      let perPayeeAmount = (this.transactionService.selectedUsers.amount / (this.transactionService.selectedUsers.payeeIds.length + 1));
      this.transactionService.selectedUsers.payeeDetails[0].amount = perPayeeAmount;
      for (let i = 0; i < this.transactionService.selectedUsers.payeeIds.length; i++) {
        var payeeObj: { _id: string, fullName: string, amount: number } = { "_id": this.transactionService.selectedUsers.payeeIds[i], "fullName": this.payeeNames[i], "amount": perPayeeAmount };
        this.transactionService.selectedUsers.payeeDetails.push(payeeObj);
      }
    }
    this.transactionService.addTransaction(this.transactionService.selectedUsers).subscribe({
      next: (res: any) => {
        console.log(res);
        this.showSucessMessage = res['message'];
        this.resetFormCreate(form);
        this.showSpinner = false;
      },
      error: (err) => {
        this.serverErrorMessages = err.error['error'];
        this.showSpinner = false;
      },
    });
    // }

  }
  // reset the form when after submit is clicked
  resetFormCreate(form: NgForm) {
    this.transactionService.selectedUsers.userIds = [];
    this.transactionService.selectedUsers.description = '';
    this.transactionService.selectedUsers.payeeIds = [];
    this.transactionService.selectedUsers.amount = 0;
    this.transactionService.selectedUsers.splitEqually = true;
    this.transactionService.selectedUsers.payeeDetails = [{ "_id": "defaultId", "fullName": "you", "amount": 0 }];
    this.selectedUser = [];
    this.selectedPayee = [];
    this.showUserList = true;
    this.showAddPayee = true;
    this.hideAddPayee = false;
    this.showPayee = false;
    this.showPayeeList = true;
    this.tempPayeeList = [{ "_id": "defaultId", "fullName": "you" }];
    this.userNames = new Array();
    this.payeeNames = new Array();
    this.addMultiplePayeeAmount = false;
    form.resetForm();
    this.serverErrorMessages = '';
    // this.showSucessMessage = '';
  }
  onUserSelect(item: any) {
    this.transactionService.selectedUsers.userIds.push(item._id);
    this.userNames.push(item.fullName);
    console.log(this.transactionService.selectedUsers.userIds)
  }
  onUserSelectAll(items: any) {
    this.transactionService.selectedUsers.userIds = [];
    console.log(items)
    for (let i = 0; i < items.length; i++) {
      this.transactionService.selectedUsers.userIds.push(items[i]._id);
      this.userNames.push(items[i].fullName);
    }
    console.log(this.transactionService.selectedUsers.userIds)
  }
  onUserDeSelect(item: any) {
    for (let i = 0; i < this.transactionService.selectedUsers.userIds.length; i++) {
      if (this.transactionService.selectedUsers.userIds[i] == item._id) {
        this.transactionService.selectedUsers.userIds.splice(i, 1);
        this.userNames.splice(i, 1);
      }
    }
    console.log(this.transactionService.selectedUsers.userIds)
  }
  onUserDeSelectAll(item: any) {
    this.transactionService.selectedUsers.userIds = [];
    this.userNames = [];
    console.log(this.transactionService.selectedUsers.userIds)
  }

  onClickShowAddPayee() {
    this.payeeDropdownList = this.allUserDetails;
    this.selectedPayee = [];
    while (this.tempPayeeList.length)
      this.tempPayeeList.pop();
    for (let i = 0; i < this.transactionService.selectedUsers.userIds.length; i++) {
      // : { _id: string, fullName: string } => this is to define the type of payeeObj
      var payeeObj: { _id: string, fullName: string } = { "_id": this.transactionService.selectedUsers.userIds[i], "fullName": this.userNames[i] }
      this.tempPayeeList.push(payeeObj);
    }
    this.payeeDropdownList = this.tempPayeeList;
    this.showAddPayee = false;
    this.showUserList = false;
    this.hideAddPayee = true;
    this.showPayee = true;
    // this.showPayeeList = true;
    console.log(this.transactionService.selectedUsers.payeeDetails)
  }
  onClickHideAddPayee() {
    this.transactionService.selectedUsers.payeeDetails = [{ "_id": "defaultId", "fullName": "you", "amount": 0 }];
    this.showAddPayee = true;
    this.showUserList = true;
    this.hideAddPayee = false;
    this.showPayee = false;
    this.showPayeeList = true;
    this.addMultiplePayeeAmount = false;
    this.selectedUser = this.payeeDropdownList;
    this.transactionService.selectedUsers.payeeIds = []
    console.log(this.transactionService.selectedUsers.payeeDetails)
  }

  onPayeeSelect(item: any) {
    this.transactionService.selectedUsers.payeeIds.push(item._id);
    this.payeeNames.push(item.fullName);
    console.log(this.transactionService.selectedUsers.payeeIds)
  }
  onPayeeSelectAll(items: any) {
    this.transactionService.selectedUsers.payeeIds = [];
    console.log(items)
    for (let i = 0; i < items.length; i++) {
      this.transactionService.selectedUsers.payeeIds.push(items[i]._id);
      this.payeeNames.push(items[i].fullName);
    }
    console.log(this.transactionService.selectedUsers.payeeIds)
  }
  onPayeeDeSelect(item: any) {
    for (let i = 0; i < this.transactionService.selectedUsers.payeeIds.length; i++) {
      if (this.transactionService.selectedUsers.payeeIds[i] == item._id) {
        this.transactionService.selectedUsers.payeeIds.splice(i, 1);
        this.payeeNames.splice(i, 1);
      }
    }
    console.log(this.transactionService.selectedUsers.payeeIds)
  }
  onPayeeDeSelectAll(item: any) {
    this.transactionService.selectedUsers.payeeIds = [];
    this.payeeNames = [];
    console.log(this.transactionService.selectedUsers.payeeIds)
  }
  onClickSplitEqually() {
    this.transactionService.selectedUsers.payeeDetails = [{ "_id": "defaultId", "fullName": "you", "amount": 0 }];
    this.showPayeeList = true;
    this.addMultiplePayeeAmount = false;
    this.transactionService.selectedUsers.splitEqually = true;
    console.log(this.transactionService.selectedUsers.payeeDetails)

  }

  onClickSplitUnequally() {
    this.transactionService.selectedUsers.splitEqually = false;
    // this.payeeDetails.pop(); // pop the default value
    let perPayeeAmount = (this.transactionService.selectedUsers.amount / (this.transactionService.selectedUsers.payeeIds.length + 1));
    this.transactionService.selectedUsers.payeeDetails[0].amount = perPayeeAmount;
    for (let i = 0; i < this.transactionService.selectedUsers.payeeIds.length; i++) {
      var payeeObj: { _id: string, fullName: string, amount: number } = { "_id": this.transactionService.selectedUsers.payeeIds[i], "fullName": this.payeeNames[i], "amount": perPayeeAmount };
      this.transactionService.selectedUsers.payeeDetails.push(payeeObj);
    }
    this.addMultiplePayeeAmount = true;
    this.showPayeeList = false;
    console.log(this.transactionService.selectedUsers.payeeDetails)
  }


}
