import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constant } from '../constant/constant';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private admin = new BehaviorSubject<boolean>(false);
  isAdmin = this.admin.asObservable();

  constructor() {
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

  setAdminStatus(token: string | null) {
    if (token && !this.isTokenExpired(token)) {
      try {
        const decoded: any = jwtDecode(token);
        //console.log('Decoded token:', decoded); // Testiranje
        const isAdmin = decoded.isAdmin === 'yes';
        this.admin.next(isAdmin);
      } catch (e) {
        console.error('Failed to decode token:', e);
        this.admin.next(false);
      }
    } else {
      this.admin.next(false);
    }
  }

  checkToken() {
    const token = localStorage.getItem(Constant.LOCAL_STORAGE_TOKEN);
    this.setAdminStatus(token);
  }
}
