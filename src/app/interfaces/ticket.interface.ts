import { Bet } from "./bet.interface";

export interface Ticket {
    id?: number;
    client_id: number;
    total_amount: number;
    status: 'pending' | 'winner' | 'loser';
    created_at?: string;
    bets?: Bet[];
}