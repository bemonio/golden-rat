import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LotteryMultiplierService } from '../../../services/lottery_multiplier.service';
import { LotteryMultiplier } from '../../../interfaces/lottery_multiplier.interface';
import { LotteryService } from '../../../services/lottery.service';
import { Lottery } from '../../../interfaces/lottery.interface';

@Component({
  selector: 'app-lottery-multiplier-list',
  templateUrl: './lottery_multiplier_list.page.html',
  styleUrls: ['./lottery_multiplier_list.page.scss'],
})
export class LotteryMultiplierListPage implements OnInit {
  lottey_multipliers: LotteryMultiplier[] = [];
  lotteries: { [key: number]: Lottery } = {};
  searchQuery = '';
  isLoading = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private lotteryMultiplierService: LotteryMultiplierService,
    private lotteryService: LotteryService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.loadLotteryMultipliers();
  }

  async ionViewWillEnter() {
    await this.loadLotteryMultipliers();
  }

  async loadLotteryMultipliers() {
    this.isLoading = true;
    const loading = await this.loadingController.create({ message: 'Cargando...' });
    await loading.present();

    try {
      this.lottey_multipliers = await this.lotteryMultiplierService.getAllLotteryMultipliers();
      const lotteryIds = [...new Set(this.lottey_multipliers.map(mul => mul.lottery_id))];

      const lotteriesArray = await Promise.all(lotteryIds.map(async id => {
        const lottery = await this.lotteryService.getLotteryById(id);
        return lottery ? { id: lottery.id, lottery } : null;
      }));

      this.lotteries = lotteriesArray
        .filter((cur): cur is { id: number; lottery: Lottery } => cur !== null)
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.lottery }), {});

    } catch (error) {
      console.error('Error cargando los multiplicadores:', error);
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  search(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  addLotteryMultiplier() {
    this.router.navigate(['/lottery_multiplier/add']);
  }

  editLotteryMultiplier(id: number) {
    this.router.navigate([`/lottery_multiplier/${id}/edit`]);
  }

  viewLotteryMultiplier(id: number) {
    this.router.navigate([`/lottery_multiplier/${id}/view`]);
  }

  async deleteLotteryMultiplier(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este multiplicador?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.lotteryMultiplierService.deleteLotteryMultiplier(id);
            await this.loadLotteryMultipliers();
          },
        },
      ],
    });

    await alert.present();
  }
}
