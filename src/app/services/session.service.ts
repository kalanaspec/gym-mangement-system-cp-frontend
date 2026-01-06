import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private router = inject(Router);
  
  private sessionTimeout: number = environment.sessionTimeout;
  private useCookies: boolean = environment.useCookies;
  private cookieName: string = environment.cookieName;
  private sessionExpiryCookieName: string = environment.sessionExpiryCookieName;
  
  private sessionTimer: any;
  private activityTimer: any;
  private sessionExpiryTime: number | null = null;
  
  // Observable to notify when session is about to expire
  private sessionExpiringSubject = new Subject<number>();
  public sessionExpiring$: Observable<number> = this.sessionExpiringSubject.asObservable();
  
  // Observable to notify when session expires
  private sessionExpiredSubject = new Subject<void>();
  public sessionExpired$: Observable<void> = this.sessionExpiredSubject.asObservable();

  constructor() {
    this.initializeActivityListeners();
  }

  /**
   * Initialize session after login
   */
  startSession(token: string): void {
    const expiryTime = Date.now() + this.sessionTimeout;
    this.sessionExpiryTime = expiryTime;
    
    if (this.useCookies) {
      this.setCookie(this.cookieName, token, this.sessionTimeout);
      this.setCookie(this.sessionExpiryCookieName, expiryTime.toString(), this.sessionTimeout);
    } else {
      localStorage.setItem('token', token);
      localStorage.setItem('sessionExpiry', expiryTime.toString());
    }
    
    this.startSessionTimer();
    this.resetActivityTimer();
  }

  /**
   * Check if current session is valid
   */
  isSessionValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const expiryTime = this.getSessionExpiryTime();
    if (!expiryTime) {
      return false;
    }

    const now = Date.now();
    if (now >= expiryTime) {
      this.endSession();
      return false;
    }

    return true;
  }

  /**
   * Get session expiry time
   */
  getSessionExpiryTime(): number | null {
    if (this.sessionExpiryTime) {
      return this.sessionExpiryTime;
    }

    const expiryStr = this.useCookies 
      ? this.getCookie(this.sessionExpiryCookieName)
      : localStorage.getItem('sessionExpiry');
    
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      this.sessionExpiryTime = expiry;
      return expiry;
    }

    return null;
  }

  /**
   * Get remaining session time in milliseconds
   */
  getRemainingSessionTime(): number {
    const expiryTime = this.getSessionExpiryTime();
    if (!expiryTime) {
      return 0;
    }

    const remaining = expiryTime - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Extend session by resetting the expiry time
   */
  extendSession(): void {
    if (this.isSessionValid()) {
      const token = this.getToken();
      if (token) {
        this.startSession(token);
      }
    }
  }

  /**
   * End session and clear all data
   */
  endSession(): void {
    this.clearSessionTimer();
    this.clearActivityTimer();
    this.sessionExpiryTime = null;
    
    if (this.useCookies) {
      this.deleteCookie(this.cookieName);
      this.deleteCookie(this.sessionExpiryCookieName);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('sessionExpiry');
    }
    
    // Clear user data from localStorage
    localStorage.removeItem('currentUser');
    
    this.sessionExpiredSubject.next();
    
    // Force hard redirect to login to ensure component is unloaded
    // This ensures that protected route components are completely removed
    if (this.router.url !== '/login' && !this.router.url.startsWith('/login')) {
      window.location.href = '/login';
    }
  }

  /**
   * Get token from storage
   */
  getToken(): string | null {
    if (this.useCookies) {
      return this.getCookie(this.cookieName);
    }
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated (has a token)
   * Note: This only checks for token existence, not validity
   * Use isSessionValid() to check if session is still valid
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Start session timer to monitor expiration
   */
  private startSessionTimer(): void {
    this.clearSessionTimer();
    
    const checkInterval = 1000; // Check every second
    const warningTime = 5 * 60 * 1000; // Warn 5 minutes before expiry
    
    this.sessionTimer = setInterval(() => {
      const expiryTime = this.getSessionExpiryTime();
      
      // If no expiry time, session is invalid
      if (!expiryTime) {
        this.clearSessionTimer();
        this.endSession();
        return;
      }

      const now = Date.now();
      const remaining = expiryTime - now;
      
      // Session expired
      if (remaining <= 0) {
        this.clearSessionTimer();
        this.endSession();
        return;
      }
      
      // Warn when 5 minutes remaining (only once)
      if (remaining > 0 && remaining <= warningTime && remaining > warningTime - checkInterval) {
        this.sessionExpiringSubject.next(remaining);
      }
    }, checkInterval);
  }

  /**
   * Reset activity timer to extend session on user activity
   */
  private resetActivityTimer(): void {
    // Optionally extend session on activity
    // For now, we'll just track activity but not auto-extend
    // You can modify this behavior if needed
  }

  /**
   * Initialize activity listeners to track user interaction
   */
  private initializeActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        if (this.isSessionValid()) {
          // Reset activity timer on user activity
          this.resetActivityTimer();
        }
      }, { passive: true });
    });
  }

  /**
   * Clear session timer
   */
  private clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  /**
   * Clear activity timer
   */
  private clearActivityTimer(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  /**
   * Cookie helper methods
   */
  private setCookie(name: string, value: string, maxAge: number): void {
    const expires = new Date(Date.now() + maxAge).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; Secure=${location.protocol === 'https:'}`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /**
   * Cleanup on service destruction
   */
  ngOnDestroy(): void {
    this.clearSessionTimer();
    this.clearActivityTimer();
  }
}

