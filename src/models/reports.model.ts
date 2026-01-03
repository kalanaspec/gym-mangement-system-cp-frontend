export interface ReportsDto {
  totalMembers: number;
  totalRevenue: number;
  totalAttendance: number;
  growthRate: number;
  activeMembers: number;
  newMembersThisMonth: number;
  pendingMembers: number;
  memberRetentionRate: number;
  monthlyRevenue: number;
  totalTransactions: number;
  pendingPayments: number;
  averageTransaction: number;
  dailyAverage: number;
  peakHour: string;
  attendanceGrowth: number;
  mostActiveDay: string;
}

export interface MemberReportDto {
  memberId: number;
  name: string;
  email: string;
  status: string;
  registrationDate: string;
  paymentStatus: string;
  lastPaymentDate: string;
}

export interface PaymentReportDto {
  paymentId: number;
  memberName: string;
  amount: number;
  status: string;
  paymentDate: string;
  planName: string;
}

export interface AttendanceReportDto {
  attendanceId: number;
  memberName: string;
  timestamp: string;
  source: string;
}

