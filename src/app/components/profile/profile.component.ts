import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileService, AdminUser } from '../../services/profile.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getErrorMessage } from '../../utils/error.util';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  loading = true;
  admins: AdminUser[] = [];
  loadingAdmins = false;
  displayedColumns: string[] = ['name', 'username', 'email', 'actions'];

  constructor(
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadAdmins();
  }

  loadProfile(): void {
    this.profileService.getCurrentUser().subscribe({
      next: (data) => {
        this.username = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;
      }
    });
  }

  loadAdmins(): void {
    this.loadingAdmins = true;
    this.profileService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.loadingAdmins = false;
      },
      error: (error) => {
        console.error('Error loading admins:', error);
        this.loadingAdmins = false;
        this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
      }
    });
  }

  deleteAdmin(admin: AdminUser): void {
    if (confirm(`Are you sure you want to delete admin "${admin.username}"? This action cannot be undone.`)) {
      this.profileService.deleteAdmin(admin.userId).subscribe({
        next: () => {
          this.snackBar.open('Admin deleted successfully', 'Close', { duration: 3000 });
          this.loadAdmins();
        },
        error: (error) => {
          this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
          console.error('Error:', error);
        }
      });
    }
  }

  canDeleteAdmin(admin: AdminUser): boolean {
    return admin.username !== this.username;
  }
}

