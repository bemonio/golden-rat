import { Injectable } from '@angular/core';
import { DataService } from './data.service';

export interface Lottery {
  id?: number;
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class LotteryService {
  private storeName = 'lotteries';

  constructor(private dataService: DataService) {}

  async getAllLotteries(): Promise<Lottery[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async getLotteryById(id: number): Promise<Lottery | undefined> {
    return await this.dataService.getById(this.storeName, id);
  }

  async addLottery(lottery: Lottery): Promise<void> {
    await this.dataService.add(this.storeName, lottery);
  }

  async updateLottery(lottery: Lottery): Promise<void> {
    await this.dataService.update(this.storeName, lottery);
  }

  async deleteLottery(id: number): Promise<void> {
    await this.dataService.delete(this.storeName, id);
  }
}