import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    // Set defaults
    this.data.type = this.data.type || 'danger';
    this.data.confirmText = this.data.confirmText || 'Confirm';
    this.data.cancelText = this.data.cancelText || 'Cancel';

    // Set default icons based on type
    if (!this.data.icon) {
      switch (this.data.type) {
        case 'danger':
          this.data.icon = 'warning';
          break;
        case 'warning':
          this.data.icon = 'error_outline';
          break;
        case 'success':
          this.data.icon = 'check_circle';
          break;
        case 'info':
          this.data.icon = 'info';
          break;
        default:
          this.data.icon = 'help_outline';
      }
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

