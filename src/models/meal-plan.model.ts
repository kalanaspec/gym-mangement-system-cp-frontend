import { Member } from './member.model';

export interface MealPlan {
  mealPlanId: number;
  member: Member;
  planText: string;
}

