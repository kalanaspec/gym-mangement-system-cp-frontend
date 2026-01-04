import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealPlanService } from '../../services/meal-plan.service';
import { MemberService } from '../../services/member.service';
import { MealPlan } from '../../../models/meal-plan.model';
import { Member } from '../../../models/member.model';
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
import { getErrorMessage } from '../../utils/error.util';

@Component({
  selector: 'app-meal-plans',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './meal-plans.component.html',
  styleUrl: './meal-plans.component.css'
})
export class MealPlansComponent implements OnInit {
  displayedColumns: string[] = ['mealPlanId', 'memberName', 'planText'];
  mealPlans: MealPlan[] = [];
  loading = true;

  constructor(
    private mealPlanService: MealPlanService,
    private memberService: MemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMealPlans();
  }

  loadMealPlans(): void {
    this.mealPlanService.getAllMealPlans().subscribe({
      next: (data) => {
        this.mealPlans = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading meal plans:', error);
        this.loading = false;
      }
    });
  }

  openAddMealPlanDialog(): void {
    const dialogRef = this.dialog.open(AddMealPlanDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMealPlans();
      }
    });
  }
}

@Component({
  selector: 'app-add-meal-plan-dialog',
  template: `
    <h2 mat-dialog-title>Add Meal Plan</h2>
    <mat-dialog-content>
      <form [formGroup]="mealPlanForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Member</mat-label>
          <mat-select formControlName="memberId" required>
            <mat-option *ngFor="let member of members" [value]="member.memberId">
              {{ member.user?.name }} ({{ member.user?.email }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Plan Text</mat-label>
          <textarea matInput formControlName="planText" required rows="10"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSubmit()" [disabled]="mealPlanForm.invalid">Add Meal Plan</button>
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
export class AddMealPlanDialogComponent {
  mealPlanForm: FormGroup;
  members: Member[] = [];

  constructor(
    private fb: FormBuilder,
    private mealPlanService: MealPlanService,
    private memberService: MemberService,
    private dialogRef: MatDialogRef<AddMealPlanDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.mealPlanForm = this.fb.group({
      memberId: ['', Validators.required],
      planText: ['', Validators.required]
    });

    this.loadMembers();
  }

  loadMembers(): void {
    this.memberService.getAllMembers().subscribe({
      next: (data) => {
        this.members = data;
      },
      error: (error) => {
        console.error('Error loading members:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.mealPlanForm.valid) {
      const mealPlan: MealPlan = {
        mealPlanId: 0,
        member: this.members.find(m => m.memberId === this.mealPlanForm.value.memberId)!,
        planText: this.mealPlanForm.value.planText
      };

      this.mealPlanService.createMealPlan(mealPlan).subscribe({
        next: () => {
          this.snackBar.open('Meal plan added successfully', 'Close', { duration: 3000 });
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

