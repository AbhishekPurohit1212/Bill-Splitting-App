import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from './user.model';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  selectedUser: User = {
    fullName: '',
    email: '',
    password: '',
  };
  model = {
    fullName: null,
    password: null,
    confirmPassword: null,
  };
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };

  constructor(private http: HttpClient) { }

  //HttpMethods
  postUser(user: User) {
    return this.http.post(environment.BaseUrl + '/register', user);
  }
  login(authCredentials: any) {
    return this.http.post(
      environment.BaseUrl + '/authenticate',
      authCredentials,
      this.noAuthHeader
    );
  }

  getUserProfile() {
    return this.http.get(environment.BaseUrl + '/userProfile');
  }

  editUserProfile(body: any) {
    return this.http.patch(environment.BaseUrl + '/userProfile', body);
  }
  getGroups() {
    return this.http.get(environment.BaseUrl + '/user');
  }

  updateGroup(body: any) {
    return this.http.patch(environment.BaseUrl + '/user', body);
  }

  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload) return userPayload.exp > Date.now() / 1000;
    else return false;
  }
}
