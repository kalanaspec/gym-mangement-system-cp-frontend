import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../services/member.service';
import { Member, AddMemberDto } from '../../../models/member.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { getErrorMessage } from '../../utils/error.util';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-members',
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
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {
  displayedColumns: string[] = ['admissionNumber', 'memberId', 'name', 'email', 'gender', 'phoneNumber', 'height', 'weight', 'address', 'status', 'paymentStatus', 'actions'];
  members: Member[] = [];
  loading = true;

  constructor(
      private memberService: MemberService,
      private dialog: MatDialog,
      private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.memberService.getAllMembers().subscribe({
      next: (data) => {
        this.members = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.loading = false;
        this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
      }
    });
  }

  approveMember(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'confirm-dialog-container',
      disableClose: false,
      data: {
        title: 'Approve Member',
        message: 'Are you sure you want to approve this member? Once approved, the member will be able to access gym facilities.',
        confirmText: 'Approve',
        cancelText: 'Cancel',
        type: 'success',
        icon: 'verified'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberService.approveMember(id).subscribe({
          next: () => {
            this.snackBar.open('Member approved successfully', 'Close', { duration: 3000 });
            this.loadMembers();
          },
          error: (error) => {
            this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      }
    });
  }

  updateStatus(id: number, status: string): void {
    // status parameter is the NEW status that will be set (what we're changing TO)
    const isActivating = status === 'active';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'confirm-dialog-container',
      disableClose: false,
      data: {
        title: isActivating ? 'Activate Member' : 'Deactivate Member',
        message: isActivating
          ? 'Are you sure you want to activate this member? The member will gain full access to all gym facilities.'
          : 'Are you sure you want to deactivate this member? The member will lose access to gym facilities until reactivated.',
        confirmText: isActivating ? 'Activate' : 'Deactivate',
        cancelText: 'Cancel',
        type: isActivating ? 'success' : 'warning',
        icon: isActivating ? 'check_circle' : 'pause_circle'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberService.updateMemberStatus(id, status).subscribe({
          next: () => {
            this.snackBar.open(`Member ${isActivating ? 'activated' : 'deactivated'} successfully`, 'Close', { duration: 3000 });
            this.loadMembers();
          },
          error: (error) => {
            this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      }
    });
  }

  setPaymentPaid(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'confirm-dialog-container',
      disableClose: false,
      data: {
        title: 'Mark Payment as Paid',
        message: 'Are you sure you want to mark this member\'s payment as PAID? The monthly fee of ₹2500 will be recorded as received.',
        confirmText: 'Mark as Paid',
        cancelText: 'Cancel',
        type: 'success',
        icon: 'check_circle'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberService.setPaymentPaid(id).subscribe({
          next: () => {
            this.snackBar.open('Payment status set to PAID (Monthly: 2500)', 'Close', { duration: 3000 });
            this.loadMembers();
          },
          error: (error) => {
            this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      }
    });
  }

  setPaymentUnpaid(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'confirm-dialog-container',
      disableClose: false,
      data: {
        title: 'Mark Payment as Unpaid',
        message: 'Are you sure you want to mark this member\'s payment as UNPAID? This indicates the member has pending payment dues.',
        confirmText: 'Mark as Unpaid',
        cancelText: 'Cancel',
        type: 'warning',
        icon: 'error_outline'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberService.setPaymentUnpaid(id).subscribe({
          next: () => {
            this.snackBar.open('Payment status set to UNPAID', 'Close', { duration: 3000 });
            this.loadMembers();
          },
          error: (error) => {
            this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      }
    });
  }

  deleteMember(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'confirm-dialog-container',
      disableClose: false,
      data: {
        title: 'Delete Member',
        message: 'Are you sure you want to delete this member? This action cannot be undone and all associated data will be permanently removed.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberService.deleteMember(id).subscribe({
          next: () => {
            this.snackBar.open('Member deleted successfully', 'Close', { duration: 3000 });
            this.loadMembers();
          },
          error: (error) => {
            this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      }
    });
  }

  openAddMemberDialog(): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }

  editMember(member: Member): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: member,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }
}

@Component({
  selector: 'app-add-member-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-icon">
          <mat-icon>{{ isEditMode ? 'edit' : 'person_add' }}</mat-icon>
        </div>
        <div class="header-text">
          <h2 class="dialog-title">{{ isEditMode ? 'Edit Member' : 'Add New Member' }}</h2>
          <p class="dialog-subtitle">{{ isEditMode ? 'Update member information' : 'Enter member details' }}</p>
        </div>
        <button mat-icon-button class="close-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="memberForm">

          <!-- Personal Information Section -->
          <div class="form-section">
            <div class="section-header">
              <mat-icon class="section-icon">person</mat-icon>
              <h3 class="section-title">Personal Information</h3>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Full Name</mat-label>
                <mat-icon matPrefix>badge</mat-icon>
                <input matInput formControlName="name" placeholder="John Doe">
                <mat-error *ngIf="memberForm.get('name')?.hasError('required')">
                  Name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Email Address</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input matInput type="email" formControlName="email" placeholder="john@example.com">
                <mat-error *ngIf="memberForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="memberForm.get('email')?.hasError('email')">
                  Enter a valid email
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Phone Number</mat-label>
                <mat-icon matPrefix>phone</mat-icon>
                <input matInput type="tel" formControlName="phoneNumber" placeholder="+1 234 567 8900">
                <mat-error *ngIf="memberForm.get('phoneNumber')?.hasError('required')">
                  Phone number is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Gender</mat-label>
                <mat-icon matPrefix>wc</mat-icon>
                <mat-select formControlName="gender">
                  <mat-option value="Male">Male</mat-option>
                  <mat-option value="Female">Female</mat-option>
                  <mat-option value="Other">Other</mat-option>
                </mat-select>
                <mat-error *ngIf="memberForm.get('gender')?.hasError('required')">
                  Gender is required
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Date of Birth</mat-label>
              <mat-icon matPrefix>cake</mat-icon>
              <input matInput [matDatepicker]="picker" formControlName="dateOfBirth">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="memberForm.get('dateOfBirth')?.hasError('required')">
                Date of birth is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Address</mat-label>
              <mat-icon matPrefix>location_on</mat-icon>
              <textarea matInput formControlName="address" rows="2" placeholder="123 Main St, City, State"></textarea>
              <mat-error *ngIf="memberForm.get('address')?.hasError('required')">
                Address is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Physical Information Section -->
          <div class="form-section">
            <div class="section-header">
              <mat-icon class="section-icon">fitness_center</mat-icon>
              <h3 class="section-title">Physical Information</h3>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Height (feet)</mat-label>
                <mat-icon matPrefix>height</mat-icon>
                <input matInput type="number" formControlName="height" step="0.01" placeholder="5.8">
                <mat-hint>Enter height in feet</mat-hint>
                <mat-error *ngIf="memberForm.get('height')?.hasError('required')">
                  Height is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Weight (kg)</mat-label>
                <mat-icon matPrefix>monitor_weight</mat-icon>
                <input matInput type="number" formControlName="weight" placeholder="70">
                <mat-hint>Enter weight in kilograms</mat-hint>
                <mat-error *ngIf="memberForm.get('weight')?.hasError('required')">
                  Weight is required
                </mat-error>
              </mat-form-field>
            </div>
          </div>

          <!-- Payment Information Section -->
          <div class="form-section">
            <div class="section-header">
              <mat-icon class="section-icon">payment</mat-icon>
              <h3 class="section-title">Payment Information</h3>
            </div>

            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Payment Status</mat-label>
              <mat-icon matPrefix>account_balance_wallet</mat-icon>
              <mat-select formControlName="paymentStatus">
                <mat-option value="UNPAID">Unpaid</mat-option>
                <mat-option value="PAID">Paid</mat-option>
                <mat-option value="PENDING">Pending</mat-option>
              </mat-select>
            </mat-form-field>

            <div *ngIf="memberForm.get('paymentStatus')?.value === 'PAID'" class="payment-details">
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Payment Plan</mat-label>
                  <mat-icon matPrefix>credit_card</mat-icon>
                  <mat-select formControlName="paymentPlanType">
                    <mat-option value="MONTHLY">Monthly</mat-option>
                    <mat-option value="YEARLY">Yearly</mat-option>
                  </mat-select>
                  <mat-error *ngIf="memberForm.get('paymentPlanType')?.hasError('required')">
                    Payment plan is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Payment Amount</mat-label>
                  <mat-icon matPrefix>attach_money</mat-icon>
                  <input matInput type="number" formControlName="paymentAmount" placeholder="2500">
                  <mat-error *ngIf="memberForm.get('paymentAmount')?.hasError('required')">
                    Amount is required
                  </mat-error>
                </mat-form-field>
              </div>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button class="cancel-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        <button mat-raised-button class="submit-btn" (click)="onSubmit()" [disabled]="memberForm.invalid">
          <mat-icon>{{ isEditMode ? 'save' : 'add_circle' }}</mat-icon>
          {{ isEditMode ? 'Update Member' : 'Add Member' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      max-height: 85vh;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border-bottom: 2px solid #e2e8f0;
      position: relative;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
      flex-shrink: 0;
    }

    .header-icon mat-icon {
      font-size: 30px;
      width: 30px;
      height: 30px;
    }

    .header-text {
      flex: 1;
    }

    .dialog-title {
      margin: 0 0 4px 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary-dark);
      line-height: 1.2;
    }

    .dialog-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-primary-medium);
      font-weight: 400;
    }

    .close-btn {
      color: var(--color-primary-medium);
      flex-shrink: 0;
    }

    .close-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .dialog-content {
      padding: 24px;
      overflow-y: auto;
    }

    .form-section {
      margin-bottom: 32px;
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .form-section:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e2e8f0;
    }

    .section-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--color-secondary);
    }

    .section-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-primary-dark);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-field {
      width: 100%;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .payment-details {
      animation: slideDown 0.3s ease;
      margin-top: 16px;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dialog-actions {
      padding: 20px 24px;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-top: 2px solid #e2e8f0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .cancel-btn {
      padding: 0 24px;
      height: 44px;
      font-weight: 600;
      color: var(--color-primary-dark);
      border: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cancel-btn:hover {
      background: #f8fafc;
      border-color: var(--color-primary-medium);
    }

    .cancel-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .submit-btn {
      padding: 0 28px;
      height: 44px;
      font-weight: 600;
      background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .submit-btn:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
      transform: translateY(-2px);
    }

    .submit-btn:disabled {
      background: #e2e8f0;
      color: #94a3b8;
      box-shadow: none;
    }

    .submit-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    ::ng-deep .mat-mdc-form-field {
      font-size: 0.9rem;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: white;
    }

    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: #cbd5e1;
    }

    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__trailing {
      border-color: var(--color-secondary);
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing {
      border-color: var(--color-secondary) !important;
      border-width: 2px !important;
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-floating-label {
      color: var(--color-secondary);
    }

    ::ng-deep .mat-mdc-form-field .mat-icon {
      color: var(--color-primary-medium);
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mat-icon {
      color: var(--color-secondary);
    }

    ::ng-deep .mat-mdc-form-field-hint {
      font-size: 0.75rem;
      color: var(--color-primary-medium);
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .dialog-header {
        padding: 20px;
      }

      .dialog-title {
        font-size: 1.25rem;
      }

      .header-icon {
        width: 48px;
        height: 48px;
      }

      .header-icon mat-icon {
        font-size: 26px;
        width: 26px;
        height: 26px;
      }

      .form-section {
        padding: 20px;
      }

      .dialog-actions {
        flex-direction: column;
      }

      .cancel-btn,
      .submit-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class AddMemberDialogComponent {
  memberForm: FormGroup;
  isEditMode: boolean = false;
  memberId?: number;

  constructor(
      private fb: FormBuilder,
      private memberService: MemberService,
      private dialogRef: MatDialogRef<AddMemberDialogComponent>,
      private snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: Member | null
  ) {
    this.isEditMode = !!data;
    this.memberId = data?.memberId;

    const heightInFeet = data?.height ? data.height / 30.48 : 0;
    const dateOfBirth = data?.dateOfBirth ? new Date(data.dateOfBirth) : null;

    this.memberForm = this.fb.group({
      name: [data?.user?.name || '', Validators.required],
      email: [data?.user?.email || '', [Validators.required, Validators.email]],
      address: [data?.address || '', Validators.required],
      dateOfBirth: [dateOfBirth, Validators.required],
      height: [heightInFeet, [Validators.required, Validators.min(0)]],
      weight: [data?.weight || 0, [Validators.required, Validators.min(0)]],
      gender: [data?.gender || '', Validators.required],
      phoneNumber: [data?.phoneNumber || '', Validators.required],
      paymentStatus: [data?.paymentStatus || 'UNPAID'],
      paymentPlanType: [data?.paymentPlanType || ''],
      paymentAmount: [data?.paymentAmount || 0]
    });

    this.memberForm.get('paymentStatus')?.valueChanges.subscribe(status => {
      const planTypeControl = this.memberForm.get('paymentPlanType');
      const amountControl = this.memberForm.get('paymentAmount');

      if (status === 'PAID') {
        planTypeControl?.setValidators([Validators.required]);
        amountControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        planTypeControl?.clearValidators();
        amountControl?.clearValidators();
        planTypeControl?.setValue('');
        amountControl?.setValue(0);
      }
      planTypeControl?.updateValueAndValidity();
      amountControl?.updateValueAndValidity();
    });

    if (this.isEditMode && data?.paymentStatus === 'PAID') {
      this.memberForm.get('paymentPlanType')?.setValidators([Validators.required]);
      this.memberForm.get('paymentAmount')?.setValidators([Validators.required, Validators.min(0)]);
      this.memberForm.get('paymentPlanType')?.updateValueAndValidity();
      this.memberForm.get('paymentAmount')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      const formValue = this.memberForm.value;
      const heightInCm = formValue.height ? formValue.height * 30.48 : 0;
      const memberData: AddMemberDto = {
        name: formValue.name,
        email: formValue.email,
        address: formValue.address,
        dateOfBirth: formValue.dateOfBirth.toISOString().split('T')[0],
        height: heightInCm,
        weight: formValue.weight,
        gender: formValue.gender,
        phoneNumber: formValue.phoneNumber,
        paymentStatus: formValue.paymentStatus || 'UNPAID'
      };

      if (formValue.paymentStatus === 'PAID') {
        memberData.paymentPlanType = formValue.paymentPlanType;
        memberData.paymentAmount = formValue.paymentAmount;
      }

      if (this.isEditMode && this.memberId) {
        this.memberService.updateMember(this.memberId, memberData).subscribe({
          next: () => {
            this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      } else {
        this.memberService.createMember(memberData).subscribe({
          next: () => {
            this.snackBar.open('Member added successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}