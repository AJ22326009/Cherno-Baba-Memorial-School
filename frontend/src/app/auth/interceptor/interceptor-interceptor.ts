import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

export const interceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const accessToken = localStorage.getItem('accessToken');

    if(accessToken){
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

  return next(req).pipe(
    catchError((error: HttpErrorResponse)=>{
      const isLoginReq = req.url.includes('/auth/login');
      //case 1: token expired or invalid
      if(error.status === 401 && !isLoginReq){
        //try to refresh token
        return authService.refresh().pipe(
          switchMap((res: any)=>{
            localStorage.setItem('accessToken', res.accessToken);

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`
              }
            })
            return next(retryReq);
          }),

          //if refresh also fails, logout user
          catchError((err)=>{
            authService.logout();
            return throwError(()=>err);
          })
        )
      }

      if(error.status === 0){
        router.navigate(['/error'],{ queryParams: { reason: 'Server Down' } });
        console.log('Server is down');
      }

      return throwError(()=>error);
    })
  )
};
