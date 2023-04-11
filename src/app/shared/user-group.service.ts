import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserGroupService {
  constructor(private http: HttpClient) { }

  name: string | undefined;
  creatUserGroup(name: any) {
    return this.http.post(environment.BaseUrl + '/user_group', name);
  }
  getAllUsers(groupId: any) {
    return this.http.get(environment.BaseUrl + `/user_group?groupId=${groupId}`);
  }

}
