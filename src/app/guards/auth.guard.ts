import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const sessionService = inject(SessionService);
  const router = inject(Router);

  // Check both authentication and session validity
  if (authService.isAuthenticated() && sessionService.isSessionValid()) {
    return true;
  }

  // Session expired or not authenticated
  sessionService.endSession();
  router.navigate(['/login']);
  return false;
};

