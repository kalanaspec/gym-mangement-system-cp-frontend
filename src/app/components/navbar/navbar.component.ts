import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isCollapsed = false;
  isMobileMenuOpen = false;
  isMobile = false;

  constructor(
      public authService: AuthService,
      private router: Router,
      private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.updateBodyClass();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 968;
    if (!this.isMobile) {
      this.isMobileMenuOpen = false;
      this.renderer.removeClass(document.querySelector('.sidebar'), 'mobile-open');
    }
  }

  toggleSidebar(): void {
    if (!this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
      this.updateBodyClass();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const sidebar = document.querySelector('.sidebar');
    if (this.isMobileMenuOpen) {
      this.renderer.addClass(sidebar, 'mobile-open');
    } else {
      this.renderer.removeClass(sidebar, 'mobile-open');
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.renderer.removeClass(document.querySelector('.sidebar'), 'mobile-open');
  }

  updateBodyClass(): void {
    if (this.isCollapsed) {
      this.renderer.addClass(document.body, 'sidebar-collapsed');
    } else {
      this.renderer.removeClass(document.body, 'sidebar-collapsed');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}