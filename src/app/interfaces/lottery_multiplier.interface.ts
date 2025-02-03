export interface LotteryMultiplier {
  id?: number;
  lottery_id: number;
  type: 'animal' | 'triple' | 'terminal';
  multiplier: number;
  created_at?: string;
}
