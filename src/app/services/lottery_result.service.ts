import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LotteryResult } from '../interfaces/lottery_result.interface';

@Injectable({
  providedIn: 'root',
})
export class LotteryResultService {
  private storeName = 'lottery_results';

  constructor(private dataService: DataService) {}

  async getLotteryResultById(id: number): Promise<LotteryResult | undefined> {
    return await this.dataService.getById(this.storeName, id);
  }

  async getAllLotteryResults(): Promise<LotteryResult[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async addLotteryResult(lotteryResult: LotteryResult): Promise<LotteryResult> {
    return await this.dataService.add(this.storeName, lotteryResult);
  }

  async updateLotteryResult(lotteryResult: LotteryResult): Promise<void> {
    await this.dataService.update(this.storeName, lotteryResult);
  }

  async deleteLotteryResult(id: number): Promise<void> {
    await this.dataService.delete(this.storeName, id);
  }
}
