import { Member } from './member.model';
import { PaymentPlan } from './payment-plan.model';

export interface Payment {
  paymentId: number;
  member: Member;
  plan: PaymentPlan;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'paid' | 'pending' | 'expired';
}

