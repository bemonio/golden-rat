import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LotterySchedule } from '../interfaces/lottery_schedule.interface';

@Injectable({
  providedIn: 'root',
})
export class LotteryScheduleService {
  private storeName = 'lottery_schedules';

  constructor(private dataService: DataService) {}

  async getAllLotterySchedules(): Promise<LotterySchedule[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async getLotteryScheduleById(id: number): Promise<LotterySchedule | void> {
    return await this.dataService.getById(this.storeName, id);
  }

  async addLotterySchedule(schedule: LotterySchedule): Promise<LotterySchedule> {
    return await this.dataService.add(this.storeName, schedule);
  }

  async updateLotterySchedule(schedule: LotterySchedule): Promise<LotterySchedule | void> {
    return await this.dataService.update(this.storeName, schedule);
  }

  async deleteLotterySchedule(scheduleId: number): Promise<void> {
    await this.dataService.delete(this.storeName, scheduleId);
  }

  async getLotterySchedulesByLotteryId(lotteryId: number): Promise<LotterySchedule[]> {
    const allLotterySchedules = await this.getAllLotterySchedules();
    return allLotterySchedules.filter((schedule) => schedule.lotteryId === lotteryId);
  }

  async addMultipleLotterySchedules(lotteryId: number, schedules: LotterySchedule[]): Promise<void> {
    for (const schedule of schedules) {
      await this.addLotterySchedule({ ...schedule, lotteryId });
    }
  }
}
