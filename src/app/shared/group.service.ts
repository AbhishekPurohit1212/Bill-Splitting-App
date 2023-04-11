import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  name1: string | undefined;
  name2: string | undefined;
  createGroup(name: any) {
    return this.http.post(environment.BaseUrl + '/group', name);
  }

  getGroup(id: any) {
    return this.http.get(environment.BaseUrl + `/group/${id}`);
  }

  //Helper Methods

  setGroupIds(groupList: any) {
    let groupIds = groupList.map(function (el: any) {
      var o = Object.assign({}, el);
      return o.group[0]._id;
    });
    console.log(groupIds);
    localStorage.setItem('groupIds', JSON.stringify(groupIds));
  }

  getGroupIds() {
    const obj = localStorage.getItem('groupIds');
    if (obj)
      return JSON.parse(obj)
    else
      return [];
  }

  deleteGroupIds() {
    localStorage.removeItem('groupIds');

  }

  isAdded(id: any): Boolean {
    const groupIds: any = this.getGroupIds();
    if (groupIds.includes(id)) {
      return true;
    }
    return false
  }
}
