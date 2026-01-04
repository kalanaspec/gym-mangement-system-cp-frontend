import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  // Clone request and add authorization header if token exists
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we get a 401 Unauthorized, clear token and redirect to login
      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

