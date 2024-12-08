import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constant } from '../constant/constant';
import { jwtDecode } from 'jwt-decode';
import { AdminService } from './admin.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();

  router = inject(Router);

  constructor(
    private adminService: AdminService,
    private userService: UserService
  ) {
    this.checkToken();
  }

  isTokenExpired(token: string | null): boolean {
    if (!token) {
      return true;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (e) {
      return true;
    }
  }

  checkToken() {
    const token = localStorage.getItem(Constant.LOCAL_STORAGE_TOKEN);
    if (token && !this.isTokenExpired(token)) {
      this.loggedIn.next(true);
      this.adminService.setAdminStatus(token);
    } else {
      this.loggedIn.next(false);
      this.adminService.setAdminStatus(null);
    }
  }

  login(token: any) {
    localStorage.setItem(Constant.LOCAL_STORAGE_TOKEN, token);
    this.loggedIn.next(true);
    this.adminService.setAdminStatus(token);
  }

  logout() {
    localStorage.removeItem(Constant.LOCAL_STORAGE_TOKEN);
    this.loggedIn.next(false);
    this.adminService.setAdminStatus(null);
    this.userService.setUserList([]);
    this.router.navigate(['/login']);
  }
}
