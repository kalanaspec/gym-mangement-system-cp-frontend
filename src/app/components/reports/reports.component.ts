import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportsService } from '../../services/reports.service';
import { ReportsDto, MemberReportDto, PaymentReportDto, AttendanceReportDto } from '../../../models/reports.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  stats: ReportsDto | null = null;
  memberReports: MemberReportDto[] = [];
  paymentReports: PaymentReportDto[] = [];
  attendanceReports: AttendanceReportDto[] = [];
  loading = true;

  memberColumns: string[] = ['memberId', 'name', 'email', 'status', 'registrationDate', 'paymentStatus'];
  paymentColumns: string[] = ['paymentId', 'memberName', 'amount', 'status', 'paymentDate', 'planName'];
  attendanceColumns: string[] = ['attendanceId', 'memberName', 'timestamp', 'source'];

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportsService.getOverallStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });

    this.reportsService.getMemberReports().subscribe({
      next: (data) => {
        this.memberReports = data;
      },
      error: (error) => {
        console.error('Error loading member reports:', error);
      }
    });

    this.reportsService.getPaymentReports().subscribe({
      next: (data) => {
        this.paymentReports = data;
      },
      error: (error) => {
        console.error('Error loading payment reports:', error);
      }
    });

    this.reportsService.getAttendanceReports().subscribe({
      next: (data) => {
        this.attendanceReports = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading attendance reports:', error);
        this.loading = false;
      }
    });
  }
}

