import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LotteryOption } from '../interfaces/lottery_option.interface';

@Injectable({
  providedIn: 'root',
})
export class LotteryOptionService {
  private storeName = 'lottery_options';

  constructor(
    private dataService: DataService
  ) {}

  async getAllLotteryOptions(): Promise<LotteryOption[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async getLotteryOptionById(id: number): Promise<LotteryOption | undefined> {
    return await this.dataService.getById(this.storeName, id);
  }

  async addLotteryOption(option: LotteryOption): Promise<void> {
    await this.dataService.add(this.storeName, option);
  }

  async updateLotteryOption(option: LotteryOption): Promise<void> {
    await this.dataService.update(this.storeName, option);
  }

  async deleteLotteryOption(id: number): Promise<void> {
    await this.dataService.delete(this.storeName, id);
  }

  async getLotteryOptionsByLotteryId(lotteryId: number): Promise<LotteryOption[]> {
    const allOptions = await this.getAllLotteryOptions();
    return allOptions.filter((option) => option.lotteryId === lotteryId);
  }

  async addMultipleOptions(lotteryId: number, options: Omit<LotteryOption, 'lotteryId'>[]): Promise<void> {
    for (const option of options) {
      await this.addLotteryOption({ ...option, lotteryId });
    }
  }

  generateOptions(type: 'terminal' | 'triple' | 'animal', lotteryId: number): LotteryOption[] {
    if (type === 'terminal' || type === 'triple') {
      const max = type === 'terminal' ? 99 : 999;
      const options: LotteryOption[] = [];
      for (let i = 0; i <= max; i++) {
        options.push({
          lotteryId: lotteryId,
          name: i.toString().padStart(type === 'terminal' ? 2 : 3, '0'),
          type: type
        });
      }
      return options;
    } else if (type === 'animal') {
      const animals = ['Tigre', 'Elefante', 'León'];
      return animals.map((animal) => ({
        lotteryId: lotteryId,
        name: animal,
        type: 'animal'
      }));
    } else {
      throw new Error(`Tipo no soportado: ${type}`);
    }
  }
}