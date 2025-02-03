export interface Ticket {
    id?: number;
    client_id: number;
    total_amount: number;
    status: 'pending' | 'partial_winner' | 'winner' | 'loser';
    payout_amount: number;
    is_paid: boolean;
    created_at?: string;
}