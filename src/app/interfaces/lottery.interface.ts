export interface Lottery {
  id?: number;
  name: string;
  type: 'animal' | 'triple' | 'terminal';
  created_at?: string;
}