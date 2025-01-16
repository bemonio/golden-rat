export interface LotterySchedule {
  id?: number;
  lotteryId: number;
  dayOfWeek: string;
  time: string;
  isActive: boolean;
}