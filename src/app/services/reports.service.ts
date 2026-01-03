import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportsDto, MemberReportDto, PaymentReportDto, AttendanceReportDto } from '../../models/reports.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:8080/api/reports';

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
}

