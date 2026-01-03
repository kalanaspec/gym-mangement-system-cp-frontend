import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { MemberService } from '../../services/member.service';
import { AttendanceDto } from '../../../models/attendance.model';
import { Member } from '../../../models/member.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  members: Member[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private memberService: MemberService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.attendanceForm = this.fb.group({
      memberId: ['', Validators.required],
      source: ['Front Desk', Validators.required]
    });
  }

  ngOnInit(): void {
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

  logAttendance(): void {
    if (this.attendanceForm.valid) {
      const attendance: AttendanceDto = {
        memberId: this.attendanceForm.value.memberId,
        timestamp: new Date().toISOString(),
        source: this.attendanceForm.value.source
      };

      this.attendanceService.logAttendance(attendance).subscribe({
        next: () => {
          this.snackBar.open('Attendance logged successfully', 'Close', { duration: 3000 });
          this.attendanceForm.reset({ source: 'Front Desk' });
        },
        error: (error) => {
          this.snackBar.open('Error logging attendance', 'Close', { duration: 3000 });
          console.error('Error:', error);
        }
      });
    }
  }
}

