import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceDto } from '../../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://localhost:8080/api/attendance';

  constructor(private http: HttpClient) {}

  logAttendance(dto: AttendanceDto): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/log`, dto, { responseType: 'text' as 'json' });
  }
}

