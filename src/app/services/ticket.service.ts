import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Ticket } from '../interfaces/ticket.interface';
import { Bet } from '../interfaces/bet.interface';
import { BetService } from './bet.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private storeName = 'tickets';

  constructor(
    private dataService: DataService,
    private betService: BetService
  ) {}

  async getTicketById(id: number): Promise<Ticket | undefined> {
    const ticket = await this.dataService.getById(this.storeName, id);
    if (ticket) {
      ticket.bets = await this.betService.getBetsByTicketId(id);
    }
    return ticket;
  }

  async getAllTickets(): Promise<Ticket[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async addTicket(ticket: Ticket, bets: Bet[]): Promise<Ticket> {
    const createdTicket = await this.dataService.add(this.storeName, ticket);
    if (createdTicket.id) {
      for (const bet of bets) {
        bet.ticket_id = createdTicket.id;
        await this.betService.addBet(bet);
      }
    }

    return createdTicket;
  }

  async updateTicket(ticket: Ticket): Promise<void> {
    await this.dataService.update(this.storeName, ticket);
  }

  async deleteTicket(id: number): Promise<void> {
    const bets = await this.betService.getBetsByTicketId(id);
    for (const bet of bets) {
      await this.betService.deleteBet(bet.id!);
    }
    await this.dataService.delete(this.storeName, id);
  }
}
