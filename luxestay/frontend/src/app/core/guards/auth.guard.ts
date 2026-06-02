import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  // isLoggedIn() now also checks token expiry
  if (authService.isLoggedIn()) {
    return true;
  }

  // Token missing or expired → clean up and redirect
  authService.logout();
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const adminGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};

export const loginGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  // Already logged in with valid token → go to dashboard
  if (authService.isLoggedIn()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
