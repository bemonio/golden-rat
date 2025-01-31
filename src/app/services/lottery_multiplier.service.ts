import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LotteryMultiplier } from '../interfaces/lottery_multiplier.interface';

@Injectable({
  providedIn: 'root',
})
export class LotteryMultiplierService {
  private storeName = 'lottery_multipliers';

  constructor(private dataService: DataService) {}

  async getAllLotteryMultipliers(): Promise<LotteryMultiplier[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async getLotteryMultiplierById(id: number): Promise<LotteryMultiplier | undefined> {
    return await this.dataService.getById(this.storeName, id);
  }

  async addLotteryMultiplier(multiplier: LotteryMultiplier): Promise<void> {
    await this.dataService.add(this.storeName, multiplier);
  }

  async updateLotteryMultiplier(multiplier: LotteryMultiplier): Promise<void> {
    await this.dataService.update(this.storeName, multiplier);
  }

  async deleteLotteryMultiplier(id: number): Promise<void> {
    await this.dataService.delete(this.storeName, id);
  }

  async getLotteryMultipliersByLotteryId(lotteryId: number): Promise<LotteryMultiplier[]> {
    const allMultipliers = await this.getAllLotteryMultipliers();
    return allMultipliers.filter(mul => mul.lottery_id === lotteryId);
  }
}
