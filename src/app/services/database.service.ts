import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private lotteries: any[] = [];

  async getAllLotteries() {
    return this.lotteries;
  }

  async getLotteryById(id: number) {
    return this.lotteries.find((lottery) => lottery.id === id);
  }

  async addLottery(lottery: any) {
    lottery.id = this.lotteries.length + 1;
    this.lotteries.push(lottery);
  }

  async updateLottery(id: number, updatedLottery: any) {
    const index = this.lotteries.findIndex((lottery) => lottery.id === id);
    if (index !== -1) {
      this.lotteries[index] = updatedLottery;
    }
  }
}
