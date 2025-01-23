export interface Bet {
  id?: number;
  ticket_id: number;
  lottery_id: number;
  schedule_id: number;
  option_id: number;
  amount: number;
  date: string;
  status: 'pending' | 'winner' | 'loser';
  created_at?: string;
}
