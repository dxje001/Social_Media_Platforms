import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Constant } from '../../constant/constant';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem(Constant.LOCAL_STORAGE_TOKEN);
  if (!token) {
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    if (decoded.isAdmin === 'yes') {
      return true;
    } else {
      router.navigate(['/index']);
      return false;
    }
  } catch (e) {
    return false;
  }
};
