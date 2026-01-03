export interface PaymentPlan {
  planId: number;
  name: string;
  description: string;
  planType: 'MONTHLY' | 'YEARLY';
  monthlyPrice: number;
  yearlyPrice: number;
  durationDays: number;
  price: number;
}

