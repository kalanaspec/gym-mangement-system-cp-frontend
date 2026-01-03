import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MealPlan } from '../../models/meal-plan.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  private apiUrl = `${environment.apiUrl}/api/mealplans`;

  constructor(private http: HttpClient) {}

  getAllMealPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(this.apiUrl);
  }

  createMealPlan(plan: MealPlan): Observable<MealPlan> {
    return this.http.post<MealPlan>(this.apiUrl, plan);
  }
}

