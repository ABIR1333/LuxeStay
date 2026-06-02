import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// URLs that should never have the Authorization header
const PUBLIC_URLS = ['/auth/login', '/auth/register'];

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip token injection for public endpoints
  const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));
  if (isPublic) {
    return next(req);
  }

  const token = authService.getToken();

  // Only attach token if it exists and is not expired
  if (token && !authService.isTokenExpired(token)) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        // 401 = token rejected by server → logout immediately, no retry
        if (error.status === 401) {
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  // Token missing or expired: logout and block the request
  if (token && authService.isTokenExpired(token)) {
    authService.logout();
    return throwError(() => new HttpErrorResponse({
      error: 'Token expired',
      status: 401,
      statusText: 'Unauthorized'
    }));
  }

  // No token at all: let the request through (guard will redirect)
  return next(req);
};
