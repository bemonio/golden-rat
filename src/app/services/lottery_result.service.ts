import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { BetService } from './bet.service';
import { TicketService } from './ticket.service';
import { LotteryResult } from '../interfaces/lottery_result.interface';
import { Ticket } from '../interfaces/ticket.interface';

@Injectable({
  providedIn: 'root',
})
export class LotteryResultService {
  private storeName = 'lottery_results';

  constructor(
    private dataService: DataService,
    private betService: BetService,
    private ticketService: TicketService
  ) {}

  async getLotteryResultById(id: number): Promise<LotteryResult | undefined> {
    return await this.dataService.getById(this.storeName, id);
  }

  async getAllLotteryResults(): Promise<LotteryResult[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async addLotteryResult(lotteryResult: LotteryResult): Promise<LotteryResult> {
    const result = await this.dataService.add(this.storeName, lotteryResult);

    const bets = await this.betService.getBetsByLotteryAndDate(
      lotteryResult.lottery_id,
      lotteryResult.date,
      lotteryResult.lottery_schedule_id
    );

    const ticketsToUpdate = new Map<number, Ticket>();

    for (const bet of bets) {
      bet.status = bet.option_id === lotteryResult.lottery_option_id ? 'winner' : 'loser';
      await this.betService.updateBet(bet);

      if (!ticketsToUpdate.has(bet.ticket_id)) {
        const ticket = await this.ticketService.getTicketById(bet.ticket_id);
        if (ticket) {
          ticketsToUpdate.set(bet.ticket_id, ticket);
        }
      }
    }

    for (const [ticketId, ticket] of ticketsToUpdate) {
      const ticketBets = await this.betService.getBetsByTicketId(ticketId);
      const hasWinner = ticketBets.some((bet) => bet.status === 'winner');
      ticket.status = hasWinner ? 'winner' : 'loser';
      await this.ticketService.updateTicket(ticket);
    }

    return result;
  }

  async updateLotteryResult(lotteryResult: LotteryResult): Promise<void> {
    await this.dataService.update(this.storeName, lotteryResult);
  }

  async deleteLotteryResult(id: number): Promise<void> {
    await this.dataService.delete(this.storeName, id);
  }
}
