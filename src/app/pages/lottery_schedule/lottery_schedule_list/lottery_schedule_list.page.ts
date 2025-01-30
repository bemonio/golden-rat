import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LotteryScheduleService } from '../../../services/lottery_schedule.service';
import { LotterySchedule } from '../../../interfaces/lottery_schedule.interface';

@Component({
  selector: 'app-lottery-schedule-list',
  templateUrl: './lottery_schedule_list.page.html',
  styleUrls: ['./lottery_schedule_list.page.scss'],
})
export class LotteryScheduleListPage implements OnInit {
  @Input() lotteryId?: number;
  lotterySchedules: LotterySchedule[] = [];
  searchQuery = '';
  isLoading = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private lotteryScheduleService: LotteryScheduleService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.loadLotterySchedules();
  }

  async ionViewWillEnter() {
    await this.loadLotterySchedules();
  }

  async loadLotterySchedules() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Cargando horarios de lotería...',
    });
    await loading.present();

    try {
      if (this.lotteryId) {
        this.lotterySchedules = await this.lotteryScheduleService.getLotterySchedulesByLotteryId(this.lotteryId);
      } else {
        this.lotterySchedules = await this.lotteryScheduleService.getAllLotterySchedules();
      }
    } catch (error) {
      console.error('Error cargando los horarios de lotería:', error);
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  search(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  addLotterySchedule() {
    if (this.lotteryId) {
      this.router.navigate(['/lottery_schedule/add'], {
        queryParams: { lotteryId: this.lotteryId },
      });
    } else {
      this.router.navigate(['/lottery_schedule/add']);
    }
  }

  editLotterySchedule(id: number) {
    this.router.navigate([`/lottery_schedule/${id}/edit`]);
  }

  viewLotterySchedule(id: number) {
    this.router.navigate([`/lottery_schedule/${id}/view`]);
  }

  async deleteLotterySchedule(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este horario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.lotteryScheduleService.deleteLotterySchedule(id);
            await this.loadLotterySchedules();
          },
        },
      ],
    });

    await alert.present();
  }
}