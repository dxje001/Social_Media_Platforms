import { CanActivateFn, Router } from '@angular/router';
import { Constant } from '../../constant/constant';
import { inject } from '@angular/core';

export const logInGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem(Constant.LOCAL_STORAGE_TOKEN);
    if(token != null){
        router.navigate(['/index'])
        return false;        
    } else{
        return true;
    }
};
