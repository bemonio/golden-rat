import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LotteryService } from '../../../services/lottery.service';

@Component({
  selector: 'app-lottery-list',
  templateUrl: './lottery_list.page.html',
  styleUrls: ['./lottery_list.page.scss'],
})
export class LotteryListPage implements OnInit {
  lotteries: any[] = [];
  searchQuery = '';
  isLoading = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private lotteryService: LotteryService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.loadLotteries();
  }

  async ionViewWillEnter() {
    await this.loadLotteries();
  }

  async loadLotteries() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    this.lotteries = await this.lotteryService.getAllLotteries();

    this.isLoading = false;
    await loading.dismiss();
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
            await this.lotteryService.deleteLottery(id);
            await this.loadLotteries();
          },
        },
      ],
    });

    await alert.present();
  }
}
