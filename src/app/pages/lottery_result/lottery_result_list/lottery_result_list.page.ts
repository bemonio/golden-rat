import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LotteryResultService } from '../../../services/lottery_result.service';
import { LotteryResult } from '../../../interfaces/lottery_result.interface';
import { LotteryService } from '../../../services/lottery.service';
import { LotteryScheduleService } from '../../../services/lottery_schedule.service';
import { LotteryOptionService } from '../../../services/lottery_option.service';
import { Lottery } from '../../../interfaces/lottery.interface';
import { LotterySchedule } from '../../../interfaces/lottery_schedule.interface';
import { LotteryOption } from '../../../interfaces/lottery_option.interface';

@Component({
  selector: 'app-lottery-result-list',
  templateUrl: './lottery_result_list.page.html',
  styleUrls: ['./lottery_result_list.page.scss'],
})
export class LotteryResultListPage implements OnInit {
  lotteryResults: LotteryResult[] = [];
  lotteries: { [key: number]: Lottery } = {};
  lotterySchedules: { [key: number]: LotterySchedule } = {};
  lotteryOptions: { [key: number]: LotteryOption } = {};
  searchQuery = '';
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private lotteryResultService: LotteryResultService,
    private lotteryService: LotteryService,
    private lotteryScheduleService: LotteryScheduleService,
    private lotteryOptionService: LotteryOptionService
  ) {}

  async ngOnInit() {
    await this.loadLotteryResults();
  }

  async ionViewWillEnter() {
    await this.loadLotteryResults();
  }

  async loadLotteryResults() {
    this.isLoading = true; // 🔹 Activar loading
    try {
      this.lotteryResults = await this.lotteryResultService.getAllLotteryResults();

      const lotteryIds = [...new Set(this.lotteryResults.map(res => res.lottery_id))];
      const scheduleIds = [...new Set(this.lotteryResults.map(res => res.lottery_schedule_id))];
      const optionIds = [...new Set(this.lotteryResults.map(res => res.lottery_option_id))];

      const [lotteriesArray, lotterySchedulesArray, lotteryOptionsArray] = await Promise.all([
        Promise.all(lotteryIds.map(async id => {
          const lottery = await this.lotteryService.getLotteryById(id);
          return lottery ? { id: lottery.id, lottery } : null;
        })),
        Promise.all(scheduleIds.map(async id => {
          const schedule = await this.lotteryScheduleService.getLotteryScheduleById(id);
          return schedule ? { id: schedule.id, schedule } : null;
        })),
        Promise.all(optionIds.map(async id => {
          const option = await this.lotteryOptionService.getLotteryOptionById(id);
          return option ? { id: option.id, option } : null;
        }))
      ]);

      this.lotteries = lotteriesArray
        .filter((cur): cur is { id: number; lottery: Lottery } => cur !== null)
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.lottery }), {} as { [key: number]: Lottery });

        this.lotterySchedules = lotterySchedulesArray
        .filter((cur): cur is { id: number; schedule: LotterySchedule } => cur !== null)
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.schedule }), {} as { [key: number]: LotterySchedule });

        this.lotteryOptions = lotteryOptionsArray
        .filter((cur): cur is { id: number; option: LotteryOption } => cur !== null)
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.option }), {} as { [key: number]: LotteryOption });

      } catch (error) {
      console.error('Error loading lottery results:', error);
    } finally {
      this.isLoading = false; // 🔹 Desactivar loading
    }
  }
  
  search(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  addLotteryResult() {
    this.router.navigate(['/lottery_result/add']);
  }

  editLotteryResult(id: number) {
    this.router.navigate([`/lottery_result/${id}/edit`]);
  }

  viewLotteryResult(id: number) {
    this.router.navigate([`/lottery_result/${id}/view`]);
  }

  async deleteLotteryResult(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este resultado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.lotteryResultService.deleteLotteryResult(id);
            await this.loadLotteryResults();
          },
        },
      ],
    });

    await alert.present();
  }
}
