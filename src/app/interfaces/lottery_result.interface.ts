export interface LotteryResult {
  id?: number;
  lottery_id: number;
  lottery_schedule_id: number;
  lottery_option_id: number;
  result_time?: string;
  created_at?: string;
}
