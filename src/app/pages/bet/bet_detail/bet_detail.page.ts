import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BetService } from '../../../services/bet.service';
import { Bet } from '../../../interfaces/bet.interface';
import { TicketService } from '../../../services/ticket.service';
import { LotteryService } from '../../../services/lottery.service';
import { LotteryScheduleService } from '../../../services/lottery_schedule.service';
import { LotteryOptionService } from '../../../services/lottery_option.service';
import { Ticket } from '../../../interfaces/ticket.interface';
import { Lottery } from '../../../interfaces/lottery.interface';
import { LotterySchedule } from '../../../interfaces/lottery_schedule.interface';
import { LotteryOption } from '../../../interfaces/lottery_option.interface';
import { DatePickerModalComponent } from '../../../components/datepicker_modal/datepicker_modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bet-detail',
  templateUrl: './bet_detail.page.html',
  styleUrls: ['./bet_detail.page.scss'],
})
export class BetDetailPage implements OnInit {
  mode: 'view' | 'edit' = 'view';
  betId: number = 0;
  betForm: FormGroup;
  bet: Bet | null = null;

  tickets: Ticket[] = [];
  lotteries: Lottery[] = [];
  schedules: LotterySchedule[] = [];
  options: LotteryOption[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private betService: BetService,
    private ticketService: TicketService,
    private lotteryService: LotteryService,
    private scheduleService: LotteryScheduleService,
    private optionService: LotteryOptionService,
    private modalController: ModalController
  ) {
    this.betForm = this.fb.group({
      ticket_id: [null, [Validators.required]],
      lottery_id: [null, [Validators.required]],
      schedule_id: [null, [Validators.required]],
      option_id: [null, [Validators.required]],
      amount: [0, [Validators.required, Validators.min(1)]],
      date: [null, [Validators.required]],
      status: ['pending']
    });
  }

  async ngOnInit() {
    this.bet = this.bet || {
      ticket_id: 0,
      lottery_id: 0,
      schedule_id: 0,
      option_id: 0,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      created_at: new Date().toISOString()
    };

    this.tickets = await this.ticketService.getAllTickets();
    this.lotteries = await this.lotteryService.getAllLotteries();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.url[0].path === 'add') {
      this.mode = 'edit';
    } else if (idParam) {
      this.betId = Number(idParam);
      this.mode = this.route.snapshot.url[1]?.path as 'view' | 'edit' || 'view';
      await this.loadBetData();
    }
  }

  async loadBetData() {
    if (!this.betId) return;

    const bet = await this.betService.getBetById(this.betId);
    this.bet = bet ?? null;

    if (this.bet) {
      this.schedules = await this.scheduleService.getLotterySchedulesByLotteryId(this.bet.lottery_id);
      this.options = await this.optionService.getLotteryOptionsByLotteryId(this.bet.lottery_id);
      this.betForm.patchValue(this.bet);
    }
  }

  getLotteryName(lotteryId: number): string {
    const lottery = this.lotteries.find(l => l.id === lotteryId);
    return lottery ? lottery.name : 'Desconocida';
  }

  getScheduleTime(scheduleId: number): string {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    return schedule ? `${schedule.dayOfWeek} - ${schedule.time}` : 'N/A';
  }

  getOptionName(optionId: number): string {
    const option = this.options.find(o => o.id === optionId);
    return option ? option.name : 'N/A';
  }

  async onLotteryChange() {
    const lotteryId = this.betForm.get('lottery_id')?.value;
    this.schedules = await this.scheduleService.getLotterySchedulesByLotteryId(lotteryId);
    this.options = await this.optionService.getLotteryOptionsByLotteryId(lotteryId);
  }

  async saveBet() {
    if (this.betForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const betData = this.betForm.value;

    if (this.betId) {
      await this.betService.updateBet({ id: this.betId, ...betData });
    } else {
      const createdBet = await this.betService.addBet(betData);
      if (createdBet.id !== undefined) {
        this.betId = createdBet.id;
      } else {
        alert('Hubo un problema al crear la apuesta.');
        return;
      }
    }

    this.router.navigate(['/bet']);
  }

  async openDatePicker() {
    if (!this.bet) return;
    const modal = await this.modalController.create({
      component: DatePickerModalComponent,
      componentProps: { selectedDate: this.bet.date || new Date().toISOString().split('T')[0] }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.confirmed) {
      this.bet.date = data.date;
    }
  }
}
