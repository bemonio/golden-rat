import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-lottery-list',
  templateUrl: './lottery_list.page.html',
  styleUrls: ['./lottery_list.page.scss'],
})
export class LotteryListPage implements OnInit {
  lotteries: any[] = [];
  searchQuery = '';

  constructor(private router: Router, private dbService: DatabaseService) {}

  async ngOnInit() {
    this.lotteries = await this.dbService.getAllLotteries();
  }

  search(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  viewLottery(id: number) {
    this.router.navigate([`/lottery/${id}/view`]);
  }

  editLottery(id: number) {
    this.router.navigate([`/lottery/${id}/edit`]);
  }
}