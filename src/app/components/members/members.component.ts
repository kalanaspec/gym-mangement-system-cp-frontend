import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../services/member.service';
import { Member, AddMemberDto } from '../../../models/member.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getErrorMessage } from '../../utils/error.util';

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
    MatTooltipModule
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {
  displayedColumns: string[] = ['memberId', 'name', 'email', 'gender', 'phoneNumber', 'height', 'weight', 'address', 'status', 'paymentStatus', 'actions'];
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

  updateStatus(id: number, status: string): void {
    this.memberService.updateMemberStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
        this.loadMembers();
      },
      error: (error) => {
        this.snackBar.open(getErrorMessage(error), 'Close', { duration: 3000 });
        console.error('Error:', error);
      }
    });
  }

  setPaymentPaid(id: number): void {
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

  setPaymentUnpaid(id: number): void {
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

  openAddMemberDialog(): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '500px'
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
    <h2 mat-dialog-title>Add New Member</h2>
    <mat-dialog-content>
      <form [formGroup]="memberForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>UserName</mat-label>
          <input matInput formControlName="username" required>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Address</mat-label>
          <input matInput formControlName="address" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date of Birth</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateOfBirth" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Height (feet)</mat-label>
          <input matInput type="number" formControlName="height" step="0.01" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Weight (kg)</mat-label>
          <input matInput type="number" formControlName="weight" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Gender</mat-label>
          <mat-select formControlName="gender">
            <mat-option value="Male">Male</mat-option>
            <mat-option value="Female">Female</mat-option>
            <mat-option value="Other">Other</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Phone Number</mat-label>
          <input matInput type="tel" formControlName="phoneNumber" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Payment Status</mat-label>
          <mat-select formControlName="paymentStatus">
            <mat-option value="UNPAID">UNPAID</mat-option>
            <mat-option value="PAID">PAID</mat-option>
            <mat-option value="PENDING">PENDING</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="memberForm.get('paymentStatus')?.value === 'PAID'">
          <mat-label>Payment Plan Type</mat-label>
          <mat-select formControlName="paymentPlanType">
            <mat-option value="MONTHLY">MONTHLY</mat-option>
            <mat-option value="YEARLY">YEARLY</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="memberForm.get('paymentStatus')?.value === 'PAID'">
          <mat-label>Payment Amount</mat-label>
          <input matInput type="number" formControlName="paymentAmount" [required]="memberForm.get('paymentStatus')?.value === 'PAID'">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSubmit()" [disabled]="memberForm.invalid">Add Member</button>
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class AddMemberDialogComponent {
  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private dialogRef: MatDialogRef<AddMemberDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      height: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      paymentStatus: ['UNPAID'],
      paymentPlanType: [''],
      paymentAmount: [0]
    });

    // Add conditional validation for payment fields
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
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      const formValue = this.memberForm.value;
      // Convert height from feet to centimeters for storage (1 foot = 30.48 cm)
      const heightInCm = formValue.height ? formValue.height * 30.48 : 0;
      const memberData: AddMemberDto = {
        name: formValue.name,
        email: formValue.email,
        username: formValue.username,
        password: formValue.password,
        address: formValue.address,
        dateOfBirth: formValue.dateOfBirth.toISOString().split('T')[0],
        height: heightInCm,
        weight: formValue.weight,
        gender: formValue.gender,
        phoneNumber: formValue.phoneNumber,
        paymentStatus: formValue.paymentStatus || 'UNPAID'
      };

      // Only include payment fields if status is PAID
      if (formValue.paymentStatus === 'PAID') {
        memberData.paymentPlanType = formValue.paymentPlanType;
        memberData.paymentAmount = formValue.paymentAmount;
      }

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

  onCancel(): void {
    this.dialogRef.close();
  }
}

