import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { getErrorMessage } from '../../utils/error.util';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent {
  registerForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private snackBar: MatSnackBar,
      private dialog: MatDialog
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      // Show confirmation dialog
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        maxWidth: '95vw',
        panelClass: 'confirm-dialog-container',
        disableClose: false,
        data: {
          title: 'Register New Admin',
          message: `Are you sure you want to register "${formData.name}" as a new admin? This will grant full administrative access to the system.`,
          confirmText: 'Register Admin',
          cancelText: 'Cancel',
          type: 'success',
          icon: 'person_add'
        } as ConfirmDialogData
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          // User confirmed, proceed with registration
          this.authService.registerAdmin(formData).subscribe({
            next: () => {
              this.snackBar.open('Admin registered successfully!', 'Close', { duration: 3000 });
              this.registerForm.reset();
              // Navigate to profile page
              this.router.navigate(['/profile']);
            },
            error: (error) => {
              this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
              console.error('Registration error:', error);
            }
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
    }
  }
}