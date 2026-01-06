import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, JwtResponse, User } from '../../models/user.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api/auth`;
    private sessionService = inject(SessionService);

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Use session service to manage session with cookies
        this.sessionService.startSession(response.token);
        // Keep localStorage for backward compatibility if needed
        if (!environment.useCookies) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, userData);
  }

  registerAdmin(userData: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register-admin`, userData);
  }

  logout(): void {
    this.sessionService.endSession();
    // Clear localStorage for backward compatibility
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    // Use session service to get token
    return this.sessionService.getToken();
  }

  isAuthenticated(): boolean {
    // Use session service to check authentication and session validity
    return this.sessionService.isAuthenticated();
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}

