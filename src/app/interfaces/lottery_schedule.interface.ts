export interface LotterySchedule {
  id?: number;
  lotteryId: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string;
  isActive: boolean;
  created_at?: string;
}