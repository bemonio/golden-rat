import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LotterySchedule } from '../interfaces/lottery_schedule.interface';
import { LotteryService } from './lottery.service';

@Injectable({
  providedIn: 'root',
})
export class LotteryScheduleService {
  private storeName = 'lottery_schedules';

  constructor(
    private dataService: DataService,
    private lotteryService: LotteryService
  ) {}

  async getAllLotterySchedules(): Promise<any[]> {
    const schedules: LotterySchedule[] = await this.dataService.getAll(this.storeName);
    const lotteries = await this.lotteryService.getAllLotteries();

    return schedules.map((schedule) => ({
      ...schedule,
      lotteryName: lotteries.find((lottery) => lottery.id === schedule.lotteryId)?.name || 'Desconocida',
    }));
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

  async getLotterySchedulesByLotteryId(lotteryId: number): Promise<any[]> {
    const schedules: LotterySchedule[] = await this.dataService.getAll(this.storeName);
    const filteredSchedules = schedules.filter((schedule) => schedule.lotteryId === lotteryId);

    return Promise.all(
      filteredSchedules.map(async (schedule) => {
        const lottery = await this.lotteryService.getLotteryById(schedule.lotteryId);
        return {
          ...schedule,
          lotteryName: lottery?.name || 'Desconocida',
        };
      })
    );
  }

  async addMultipleLotterySchedules(lotteryId: number, schedules: LotterySchedule[]): Promise<void> {
    for (const schedule of schedules) {
      await this.addLotterySchedule({ ...schedule, lotteryId });
    }
  }
}
