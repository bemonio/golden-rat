import { Bet } from "./bet.interface";

export interface Ticket {
    id?: number;
    client_id: number;
    total_amount: number;
    has_winner: boolean;
    created_at?: string;
    bets?: Bet[];
}