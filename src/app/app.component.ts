import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Gym Management System';
  private sessionService = inject(SessionService);
  private router = inject(Router);
  private subscriptions = new Subscription();

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Initialize session monitoring if user is already logged in
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        // Restore session from existing token
        const expiryTime = this.sessionService.getSessionExpiryTime();
        if (expiryTime && expiryTime > Date.now()) {
          // Session is still valid, restart monitoring
          this.sessionService.startSession(token);
        } else {
          // Session expired, clear and redirect
          this.sessionService.endSession();
        }
      }
    }

    // Subscribe to session expiration events
    const sessionExpiredSub = this.sessionService.sessionExpired$.subscribe(() => {
      // Session expired, force redirect to login
      console.log('Session expired - redirecting to login');
      // Force hard redirect to ensure all components are unloaded
      if (this.router.url !== '/login' && !this.router.url.startsWith('/login')) {
        window.location.href = '/login';
      }
    });

    // Subscribe to session expiring warnings (optional - for showing warnings to user)
    const sessionExpiringSub = this.sessionService.sessionExpiring$.subscribe((remainingTime) => {
      const minutes = Math.floor(remainingTime / 60000);
      console.log(`Session will expire in ${minutes} minutes`);
      // You can show a warning dialog here if needed
    });

    this.subscriptions.add(sessionExpiredSub);
    this.subscriptions.add(sessionExpiringSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

