import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthUser, JwtResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'luxestay_token';
  private readonly USER_KEY  = 'luxestay_user';

  // Cache token in memory — avoid repeated localStorage reads on every HTTP call
  private _cachedToken: string | null = localStorage.getItem(this.TOKEN_KEY);

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ─── AUTH CALLS ────────────────────────────────────────────

  login(request: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API}/login`, request).pipe(
      tap(res => {
        const user: AuthUser = {
          id:        res.id,
          firstName: res.firstName,
          lastName:  res.lastName,
          email:     res.email,
          roles:     res.roles,
          token:     res.token
        };
        // Persist and cache
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this._cachedToken = res.token;
        this.currentUserSubject.next(user);
      })
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API}/register`, request);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._cachedToken = null;
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // ─── TOKEN HELPERS ─────────────────────────────────────────

  /** Returns cached token (no localStorage read on every call) */
  getToken(): string | null {
    return this._cachedToken;
  }

  /**
   * Checks if a JWT token is expired by reading its `exp` claim.
   * Returns true if expired OR if the token cannot be parsed.
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false; // no expiry set → treat as valid
      // exp is in seconds, Date.now() in ms
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true; // malformed token → treat as expired
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.roles.includes('ROLE_ADMIN') ?? false;
  }

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.roles.includes(role) ?? false;
  }

  // ─── PRIVATE ───────────────────────────────────────────────

  private getUserFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
