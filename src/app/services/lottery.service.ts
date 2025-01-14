import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class LotteryService {
  private storeName = 'lotteries';

  constructor(private dataService: DataService) {}

  getAllLotteries() {
    return this.dataService.getAll(this.storeName);
  }

  getLotteryById(id: number) {
    return this.dataService.getById(this.storeName, id);
  }

  addLottery(lottery: { name: string; type: string }) {
    return this.dataService.add(this.storeName, lottery);
  }

  updateLottery(lottery: { id: number; name: string; type: string }) {
    return this.dataService.update(this.storeName, lottery);
  }

  deleteLottery(id: number) {
    return this.dataService.delete(this.storeName, id);
  }
}
