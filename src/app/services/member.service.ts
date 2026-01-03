import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member, AddMemberDto, UpdateMemberStatusDto, UpdateMemberPaymentDto } from '../../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:8080/api/members';

  constructor(private http: HttpClient) {}

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  createMember(member: AddMemberDto): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  approveMember(id: number): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}/approve`, {});
  }

  updateMemberStatus(id: number, status: string): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}/status`, { status });
  }

  updateMemberPayment(id: number, payment: UpdateMemberPaymentDto): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}/payment`, payment);
  }
}

