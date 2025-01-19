import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Bet } from '../interfaces/bet.interface';

@Injectable({
  providedIn: 'root',
})
export class BetService {
  private storeName = 'bets';

  constructor(private dataService: DataService) {}

  async getBetById(id: number): Promise<Bet | undefined> {
    return await this.dataService.getById(this.storeName, id);
  }

  async getAllBets(): Promise<Bet[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async addBet(bet: Bet): Promise<Bet> {
    return await this.dataService.add(this.storeName, bet);
  }

  async updateBet(bet: Bet): Promise<void> {
    await this.dataService.update(this.storeName, bet);
  }

  async deleteBet(id: number): Promise<void> {
    await this.dataService.delete(this.storeName, id);
  }

  async getBetsByTicketId(ticket_id: number): Promise<Bet[]> {
    const allBets = await this.getAllBets();
    return allBets.filter(bet => bet.ticket_id === ticket_id);
  }
}
