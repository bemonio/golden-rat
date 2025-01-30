export interface LotteryResult {
  id?: number;
  lottery_id: number;
  lottery_schedule_id: number;
  lottery_option_id: number;
  date: string;
  created_at?: string;
}
