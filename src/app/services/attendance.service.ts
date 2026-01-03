import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceDto } from '../../models/attendance.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/api/attendance`;

  constructor(private http: HttpClient) {}

  logAttendance(dto: AttendanceDto): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/log`, dto, { responseType: 'text' as 'json' });
  }
}

