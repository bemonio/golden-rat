import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Ticket } from '../interfaces/ticket.interface';
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
    return await this.dataService.getById(this.storeName, id);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async addTicket(ticket: Ticket): Promise<Ticket> {
    return await this.dataService.add(this.storeName, ticket);
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
