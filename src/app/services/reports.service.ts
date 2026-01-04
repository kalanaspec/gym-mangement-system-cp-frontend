import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportsDto, MemberReportDto, PaymentReportDto, AttendanceReportDto } from '../../models/reports.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  getOverallStats(): Observable<ReportsDto> {
    return this.http.get<ReportsDto>(`${this.apiUrl}/stats`);
  }

  getMemberReports(): Observable<MemberReportDto[]> {
    return this.http.get<MemberReportDto[]>(`${this.apiUrl}/members`);
  }

  getPaymentReports(): Observable<PaymentReportDto[]> {
    return this.http.get<PaymentReportDto[]>(`${this.apiUrl}/payments`);
  }

  getAttendanceReports(): Observable<AttendanceReportDto[]> {
    return this.http.get<AttendanceReportDto[]>(`${this.apiUrl}/attendance`);
  }

  getDailyRevenue(dayOfWeek: number): Observable<{ revenue: number; dayOfWeek: number }> {
    return this.http.get<{ revenue: number; dayOfWeek: number }>(`${this.apiUrl}/revenue/daily?dayOfWeek=${dayOfWeek}`);
  }

  getMonthlyRevenue(year: number, month: number): Observable<{ revenue: number; year: number; month: number }> {
    return this.http.get<{ revenue: number; year: number; month: number }>(`${this.apiUrl}/revenue/monthly?year=${year}&month=${month}`);
  }

  getYearlyRevenue(year: number): Observable<{ revenue: number; year: number }> {
    return this.http.get<{ revenue: number; year: number }>(`${this.apiUrl}/revenue/yearly?year=${year}`);
  }
}

