import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LotteryScheduleService } from '../../../services/lottery_schedule.service';
import { LotterySchedule } from 'src/app/interfaces/lottery_schedule.interface';

@Component({
  selector: 'app-lottery-schedule-list',
  templateUrl: './lottery_schedule_list.page.html',
  styleUrls: ['./lottery_schedule_list.page.scss'],
})
export class LotteryScheduleListPage implements OnInit {
  @Input() lotteryId?: number;
  lotterySchedules: LotterySchedule[] = [];
  searchQuery = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private lotteryScheduleService: LotteryScheduleService
  ) {}

  ngOnInit() {
    this.loadLotterySchedules();
  }

  ionViewWillEnter() {
    this.loadLotterySchedules();
  }

  async loadLotterySchedules() {
    if (this.lotteryId) {
      this.lotterySchedules = await this.lotteryScheduleService.getLotterySchedulesByLotteryId(this.lotteryId);
    } else {
      this.lotterySchedules = await this.lotteryScheduleService.getAllLotterySchedules();
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
            await this.lotteryScheduleService.deleteLotterySchedule(id);
            await this.loadLotterySchedules();
          },
        },
      ],
    });

    await alert.present();
  }
}
