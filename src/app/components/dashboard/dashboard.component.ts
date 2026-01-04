import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportsService } from '../../services/reports.service';
import { ReportsDto } from '../../../models/reports.model';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: ReportsDto | null = null;
  loading = true;

  // Revenue filters
  selectedDay: number = new Date().getDay() === 0 ? 7 : new Date().getDay(); // Monday = 1, Sunday = 7
  selectedMonth: number = new Date().getMonth() + 1; // 1-12
  selectedYear: number = new Date().getFullYear();

  // Revenue values
  dailyRevenue: number = 0;
  monthlyRevenue: number = 0;
  yearlyRevenue: number = 0;
  loadingDailyRevenue = false;
  loadingMonthlyRevenue = false;
  loadingYearlyRevenue = false;

  // Options for selectors
  daysOfWeek = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' }
  ];

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  years: number[] = [];
  selectedYearForYearly: number = new Date().getFullYear();

  constructor(private reportsService: ReportsService) {
    // Generate years from 2020 to current year + 1
    const currentYear = new Date().getFullYear();
    for (let year = 2020; year <= currentYear + 1; year++) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadDailyRevenue();
    this.loadMonthlyRevenue();
    this.loadYearlyRevenue();
  }

  loadStats(): void {
    this.reportsService.getOverallStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      }
    });
  }

  loadDailyRevenue(): void {
    this.loadingDailyRevenue = true;
    this.reportsService.getDailyRevenue(this.selectedDay).subscribe({
      next: (data) => {
        this.dailyRevenue = data.revenue;
        this.loadingDailyRevenue = false;
      },
      error: (error) => {
        console.error('Error loading daily revenue:', error);
        this.dailyRevenue = 0;
        this.loadingDailyRevenue = false;
      }
    });
  }

  loadMonthlyRevenue(): void {
    this.loadingMonthlyRevenue = true;
    this.reportsService.getMonthlyRevenue(this.selectedYear, this.selectedMonth).subscribe({
      next: (data) => {
        this.monthlyRevenue = data.revenue;
        this.loadingMonthlyRevenue = false;
      },
      error: (error) => {
        console.error('Error loading monthly revenue:', error);
        this.monthlyRevenue = 0;
        this.loadingMonthlyRevenue = false;
      }
    });
  }

  loadYearlyRevenue(): void {
    this.loadingYearlyRevenue = true;
    this.reportsService.getYearlyRevenue(this.selectedYearForYearly).subscribe({
      next: (data) => {
        this.yearlyRevenue = data.revenue;
        this.loadingYearlyRevenue = false;
      },
      error: (error) => {
        console.error('Error loading yearly revenue:', error);
        this.yearlyRevenue = 0;
        this.loadingYearlyRevenue = false;
      }
    });
  }

  onDayChange(): void {
    this.loadDailyRevenue();
  }

  onMonthChange(): void {
    this.loadMonthlyRevenue();
  }

  onYearChange(): void {
    this.loadMonthlyRevenue();
  }

  onYearlyYearChange(): void {
    this.loadYearlyRevenue();
  }

  getSelectedDayLabel(): string {
    const day = this.daysOfWeek.find(d => d.value === this.selectedDay);
    return day ? day.label : '';
  }

  getSelectedMonthLabel(): string {
    const month = this.months.find(m => m.value === this.selectedMonth);
    return month ? month.label : '';
  }
}

