import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BetService } from '../../services/bet.service';
import { LotteryService } from '../../services/lottery.service';
import { LotteryScheduleService } from '../../services/lottery_schedule.service';
import { LotteryOptionService } from '../../services/lottery_option.service';
import { SettingsService } from '../../services/settings.service';
import { Bet } from 'src/app/interfaces/bet.interface';
import { Lottery } from 'src/app/interfaces/lottery.interface';
import { LotterySchedule } from 'src/app/interfaces/lottery_schedule.interface';
import { LotteryOption } from 'src/app/interfaces/lottery_option.interface';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.page.html',
  styleUrls: ['./bet.page.scss'],
})
export class BetPage implements OnInit {
  betForm: FormGroup;
  lotteries: Lottery[] = [];
  lotterySchedules: LotterySchedule[] = [];
  lotteryOptions: LotteryOption[] = [];
  maxBetAmount: number = 100;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private betService: BetService,
    private lotteryService: LotteryService,
    private lotteryScheduleService: LotteryScheduleService,
    private lotteryOptionService: LotteryOptionService,
    private settingsService: SettingsService
  ) {
    this.betForm = this.fb.group({
      lottery_id: ['', Validators.required],
      lottery_schedule_id: ['', Validators.required],
      lottery_option_id: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  async ngOnInit() {
    this.lotteries = await this.lotteryService.getAllLotteries();
    this.maxBetAmount = (await this.settingsService.getSettingsById(1))?.max_bet_amount || 100;
  }

  async onLotteryChange() {
    const lotteryId = this.betForm.get('lottery_id')?.value;
    if (lotteryId) {
      this.lotterySchedules = await this.lotteryScheduleService.getLotterySchedulesByLotteryId(lotteryId) || [];
      this.lotteryOptions = await this.lotteryOptionService.getLotteryOptionsByLotteryId(lotteryId) || [];
    }
  }

  async saveBet() {
    if (this.betForm.invalid) return;

    const bet: Bet = this.betForm.value;
    if (bet.amount > this.maxBetAmount) {
      alert(`El monto máximo de apuesta es ${this.maxBetAmount}`);
      return;
    }

    await this.betService.addBet(bet);
    this.router.navigate(['/bet']);
  }
}