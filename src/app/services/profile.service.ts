import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/profile';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<string> {
    return this.http.get<string>(this.apiUrl, { responseType: 'text' as 'json' });
  }
}

