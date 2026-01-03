export interface Attendance {
  attendanceId: number;
  member: {
    memberId: number;
    user: {
      name: string;
      username: string;
    };
  };
  timestamp: string;
  source: string;
}

export interface AttendanceDto {
  memberId: number;
  timestamp: string;
  source: string;
}

