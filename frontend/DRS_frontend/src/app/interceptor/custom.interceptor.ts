import { HttpInterceptorFn } from '@angular/common/http';
import { Constant } from '../constant/constant';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(Constant.LOCAL_STORAGE_TOKEN);

  const authService = inject(AuthService);
  const router = inject(Router);

  if (token && authService.isTokenExpired(token)) {
    authService.logout();
    router.navigate(['/login']);
    return next(req);
  }

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(clonedReq);
};
