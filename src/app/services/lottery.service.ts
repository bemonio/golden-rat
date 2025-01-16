import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LotteryOptionService } from './lottery_option.service';
import { Lottery } from '../interfaces/lottery.interface';
import { LotteryOption } from '../interfaces/lottery_option.interface';

@Injectable({
  providedIn: 'root',
})
export class LotteryService {
  private storeName = 'lotteries';

  constructor(
    private dataService: DataService,
    private lotteryOptionService: LotteryOptionService

  ) {}

  async getAllLotteries(): Promise<Lottery[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async getLotteryById(id: number): Promise<Lottery | undefined> {
    return await this.dataService.getById(this.storeName, id);
  }

  async addLottery(lottery: Lottery): Promise<Lottery> {
    const createdLottery = await this.dataService.add(this.storeName, lottery);
    return createdLottery as Lottery;
  }
  
  async updateLottery(lottery: Lottery): Promise<void> {
    await this.dataService.update(this.storeName, lottery);
  }

  async deleteLottery(id: number): Promise<void> {
    await this.dataService.delete(this.storeName, id);
  }

  async addLotteryWithOptions(lottery: Lottery, options: Omit<LotteryOption, 'lotteryId'>[]): Promise<void> {
    const lotteryId = await this.dataService.add(this.storeName, lottery);
    await this.lotteryOptionService.addMultipleOptions(lotteryId as number, options);
  }
}