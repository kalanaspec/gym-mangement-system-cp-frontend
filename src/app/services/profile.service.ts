import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

export interface AdminUser {
  userId: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/api/profile`;
  private authUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<string> {
    return this.http.get<string>(this.apiUrl, { responseType: 'text' as 'json' });
  }

  getAllAdmins(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.authUrl}/admins`);
  }

  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.authUrl}/admins/${id}`);
  }
}

