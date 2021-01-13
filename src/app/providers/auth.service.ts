import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from '../models/auth.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl

  private token: string;
  private authStatusListner = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatus() {
    return this.authStatusListner.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email,  password: password };
    this.http.post(this.baseUrl+"api/user/signup", authData)
    .subscribe((response: any) => {
      this.toastr.success(response.message);
      this.router.navigate(['/feeds']);
      this.isAuthenticated = true;
      this.authStatusListner.next(true);
    }, error => {
      // this.toastr.error(error.error.message)
    })
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email,  password: password };
    this.http.post<{message: string, token: string, expiresIn: number, userId: string}>(this.baseUrl+"api/user/login",  authData)
    .subscribe(response => {
      this.toastr.success(response.message);
      this.router.navigate(['/feeds']);
      this.userId = response.userId
      this.setAuthTimer(response.expiresIn);
      this.isAuthenticated = true;
      this.authStatusListner.next(true);
      this.token = response.token;
      const date = new Date;
      const expiresAt = new Date(date.getTime() +  response.expiresIn * 10000);
      this.saveAuthData(this.token, expiresAt, response.userId);

    }, error => {
      // this.toastr.error(error.error.message)
    })
  }

  autoLogin() {
      const authInfo = this.getAuthData();
      if(!authInfo) { return; }
      const now = new Date();
      const expiresAt = authInfo.expiresAt.getTime() - now.getTime();
      if(expiresAt > 0) {
        this.token = authInfo.token;
        this.isAuthenticated = true;
        this.userId = authInfo.userId;
        this.setAuthTimer(expiresAt / 1000);
        this.authStatusListner.next(true);
      }
  }

  logout() {
    this.isAuthenticated = false;
      this.authStatusListner.next(false);
      this.token = null;
      this.userId = null;
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.toastr.error('You have been logged out!')
      this.router.navigate(['/auth/login']);
  }

  private setAuthTimer(duration: number) {
    console.log('Auth Timer duration ', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  private saveAuthData(token: string, expiresIn: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresAt', expiresIn.toISOString());
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');
    const userId = localStorage.getItem('userId');
    if(!token || !expiresAt) { return; }
    return { token, expiresAt: new Date(expiresAt), userId }
  }

}
