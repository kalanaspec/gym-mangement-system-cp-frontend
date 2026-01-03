import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentPlanService } from '../../services/payment-plan.service';
import { PaymentPlan } from '../../../models/payment-plan.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-payment-plans',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './payment-plans.component.html',
  styleUrl: './payment-plans.component.css'
})
export class PaymentPlansComponent implements OnInit {
  displayedColumns: string[] = ['planId', 'name', 'planType', 'monthlyPrice', 'yearlyPrice', 'durationDays', 'actions'];
  paymentPlans: PaymentPlan[] = [];
  loading = true;

  constructor(
    private paymentPlanService: PaymentPlanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPaymentPlans();
  }

  loadPaymentPlans(): void {
    this.paymentPlanService.getAllPlans().subscribe({
      next: (data) => {
        this.paymentPlans = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payment plans:', error);
        this.loading = false;
      }
    });
  }

  openAddPlanDialog(): void {
    const dialogRef = this.dialog.open(AddPaymentPlanDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPaymentPlans();
      }
    });
  }

  deletePlan(id: number): void {
    if (confirm('Are you sure you want to delete this payment plan?')) {
      this.paymentPlanService.deletePlan(id).subscribe({
        next: () => {
          this.snackBar.open('Payment plan deleted successfully', 'Close', { duration: 3000 });
          this.loadPaymentPlans();
        },
        error: (error) => {
          this.snackBar.open('Error deleting payment plan', 'Close', { duration: 3000 });
          console.error('Error:', error);
        }
      });
    }
  }
}

@Component({
  selector: 'app-add-payment-plan-dialog',
  template: `
    <h2 mat-dialog-title>Add Payment Plan</h2>
    <mat-dialog-content>
      <form [formGroup]="planForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" required></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Plan Type</mat-label>
          <mat-select formControlName="planType" required>
            <mat-option value="MONTHLY">Monthly</mat-option>
            <mat-option value="YEARLY">Yearly</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Monthly Price</mat-label>
          <input matInput type="number" formControlName="monthlyPrice" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Yearly Price</mat-label>
          <input matInput type="number" formControlName="yearlyPrice" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Duration (Days)</mat-label>
          <input matInput type="number" formControlName="durationDays" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSubmit()" [disabled]="planForm.invalid">Add Plan</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class AddPaymentPlanDialogComponent {
  planForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentPlanService: PaymentPlanService,
    private dialogRef: MatDialogRef<AddPaymentPlanDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      planType: ['MONTHLY', Validators.required],
      monthlyPrice: [0, [Validators.required, Validators.min(0)]],
      yearlyPrice: [0, [Validators.required, Validators.min(0)]],
      durationDays: [30, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.planForm.valid) {
      this.paymentPlanService.createPlan(this.planForm.value).subscribe({
        next: () => {
          this.snackBar.open('Payment plan added successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error adding payment plan', 'Close', { duration: 3000 });
          console.error('Error:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

