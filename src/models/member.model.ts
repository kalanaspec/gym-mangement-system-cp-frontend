import { User } from './user.model';

export interface Member {
  memberId: number;
  user: User;
  address: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  gender?: string;
  phoneNumber?: string;
  registrationDate: string;
  status: 'pending' | 'active' | 'inactive';
  paymentStatus: 'PAID' | 'UNPAID' | 'PENDING';
  paymentPlanType: 'MONTHLY' | 'YEARLY';
  paymentAmount: number;
  lastPaymentDate: string;
  nextPaymentDate: string;
}

export interface AddMemberDto {
  name: string;
  email: string;
  username: string;
  password: string;
  address: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  gender?: string;
  phoneNumber?: string;
  paymentStatus?: 'PAID' | 'UNPAID' | 'PENDING';
  paymentPlanType?: 'MONTHLY' | 'YEARLY';
  paymentAmount?: number;
}

export interface UpdateMemberStatusDto {
  status: string;
}

export interface UpdateMemberPaymentDto {
  paymentStatus?: string;
  planType?: string;
  amount?: number;
}

