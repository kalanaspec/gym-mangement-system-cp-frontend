import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionService } from '../services/session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  
  // Skip session validation for authentication endpoints (login, register, etc.)
  const isAuthEndpoint = req.url.includes('/api/auth/');
  
  // Only check session validity for non-auth endpoints
  if (!isAuthEndpoint && !sessionService.isSessionValid()) {
    sessionService.endSession();
    return throwError(() => new Error('Session expired'));
  }
  
  const token = sessionService.getToken();
  
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
      // If we get a 401 Unauthorized, end session and redirect to login
      // But skip this for auth endpoints to avoid redirect loops
      if (error.status === 401 && !isAuthEndpoint) {
        sessionService.endSession();
      }
      return throwError(() => error);
    })
  );
};

