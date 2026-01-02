import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

export const interceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const accessToken = localStorage.getItem('accessToken');

  if(!req.url.includes('/auth/login')){
    if(accessToken){
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  }

  return next(req).pipe(
    catchError((error)=>{
      if(error.status === 401 || error.status === 403){
        authService.logout();
      }

      if(error.status === 0){
        router.navigate(['/unauthorized']),{ queryParams: { reason: 'Server Down' } };
      }

      if(error.status === 500){
        router.navigate(['/unauthorized']),{ queryParams: { reason: 'Server Error' } };
      }

      return throwError(()=>error);
    })
  )
};
