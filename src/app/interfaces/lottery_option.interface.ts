export interface LotteryOption {
  id?: number;
  lotteryId: number;
  name: string;
  type: 'animal' | 'triple' | 'terminal';
  created_at?: string;
}
