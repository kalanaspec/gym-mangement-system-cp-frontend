import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/api/profile`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<string> {
    return this.http.get<string>(this.apiUrl, { responseType: 'text' as 'json' });
  }
}

