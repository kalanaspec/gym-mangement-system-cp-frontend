import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentPlan } from '../../models/payment-plan.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PaymentPlanService {
  private apiUrl = `${environment.apiUrl}api/payment-plans`;

  constructor(private http: HttpClient) {}

  getAllPlans(): Observable<PaymentPlan[]> {
    return this.http.get<PaymentPlan[]>(this.apiUrl);
  }

  getPlanById(id: number): Observable<PaymentPlan> {
    return this.http.get<PaymentPlan>(`${this.apiUrl}/${id}`);
  }

  createPlan(plan: PaymentPlan): Observable<PaymentPlan> {
    return this.http.post<PaymentPlan>(this.apiUrl, plan);
  }

  updatePlan(id: number, plan: PaymentPlan): Observable<PaymentPlan> {
    return this.http.put<PaymentPlan>(`${this.apiUrl}/${id}`, plan);
  }

  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

