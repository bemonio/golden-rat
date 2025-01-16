import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LotteryService } from '../../../services/lottery.service';

@Component({
  selector: 'app-lottery-list',
  templateUrl: './lottery_list.page.html',
  styleUrls: ['./lottery_list.page.scss'],
})
export class LotteryListPage implements OnInit {
  lotteries: any[] = [];
  searchQuery = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private dbService: LotteryService
  ) {}

  ngOnInit() {
    this.loadLotteries();
  }

  ionViewWillEnter() {
    this.loadLotteries();
  }

  async loadLotteries() {
    this.lotteries = await this.dbService.getAllLotteries();
  }

  search(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  addLottery() {
    this.router.navigate(['/lottery/add']);
  }

  editLottery(id: number) {
    this.router.navigate([`/lottery/${id}/edit`]);
  }

  viewLottery(id: number) {
    this.router.navigate([`/lottery/${id}/view`]);
  }

  async deleteLottery(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.dbService.deleteLottery(id);
            await this.loadLotteries();
          },
        },
      ],
    });

    await alert.present();
  }
}
