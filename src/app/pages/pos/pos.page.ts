import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { ClientService } from '../../services/client.service';
import { LotteryService } from '../../services/lottery.service';
import { LotteryScheduleService } from '../../services/lottery_schedule.service';
import { LotteryOptionService } from '../../services/lottery_option.service';
import { LotteryMultiplierService } from '../../services/lottery_multiplier.service';
import { BetService } from '../../services/bet.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Ticket } from '../../interfaces/ticket.interface';
import { Bet } from '../../interfaces/bet.interface';
import { PaymentModalComponent } from '../../components/payment_modal/payment_modal.component';
import { DatePickerModalComponent } from '../../components/datepicker_modal/datepicker_modal.component';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss']
})
export class PosPage implements OnInit {
  ticketForm: FormGroup;
  clients: any[] = [];
  lotteries: any[] = [];
  schedules: any[] = [];
  options: any[] = [];
  bet: Bet = {
    ticket_id: 0,
    lottery_id: 0,
    schedule_id: 0,
    option_id: 0,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    created_at: new Date().toISOString(),
    type: 'animal',
    multiplier: 0,
    payout_amount: 0,
    is_paid: false
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private clientService: ClientService,
    private lotteryService: LotteryService,
    private lotteryScheduleService: LotteryScheduleService,
    private lotteryOptionService: LotteryOptionService,
    private lotteryMultiplierService: LotteryMultiplierService,
    private betService: BetService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.ticketForm = this.fb.group({
      client: [null, Validators.required],
      bets: this.fb.array([], Validators.required)
    });
  }

  async ngOnInit() {
    this.clients = await this.clientService.getAllClients();
    this.lotteries = await this.lotteryService.getAllLotteries();
  }

  get bets() {
    return this.ticketForm.get('bets') as FormArray;
  }

  async selectLottery() {
    if (!this.bet.lottery_id) return;
    this.schedules = await this.lotteryScheduleService.getLotterySchedulesByLotteryId(this.bet.lottery_id);
    this.bet.schedule_id = 0;
    this.bet.option_id = 0;
  }

  async selectSchedule() {
    if (!this.bet.schedule_id) return;
    this.options = await this.lotteryOptionService.getLotteryOptionsByLotteryId(this.bet.lottery_id);
    this.bet.option_id = 0;
  }

  async selectOption() {
    console.log(this.bet);
    if (!this.bet.option_id) return;

    const selectedOption = this.options.find(o => o.id === this.bet.option_id);
    if (!selectedOption) return;

    this.bet.type = selectedOption.type;
    console.log(this.bet);

    const multipliers = await this.lotteryMultiplierService.getLotteryMultipliersByLotteryId(this.bet.lottery_id);
    const matchingMultiplier = multipliers.find(m => m.type === this.bet.type);

    this.bet.multiplier = matchingMultiplier ? matchingMultiplier.multiplier : 1;
  }

  addBet() {
    const selectedLottery = this.lotteries.find(l => l.id === this.bet.lottery_id);
    const selectedSchedule = this.schedules.find(s => s.id === this.bet.schedule_id);
    const selectedOption = this.options.find(o => o.id === this.bet.option_id);

    this.bets.push(this.fb.group({
      ...this.bet,
      lottery: selectedLottery,
      schedule: selectedSchedule,
      option: selectedOption
    }));

    this.bet = {
      ticket_id: 0,
      lottery_id: 0,
      schedule_id: 0,
      option_id: 0,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      created_at: new Date().toISOString(),
      type: 'animal',
      multiplier: 0,
      payout_amount: 0,
      is_paid: false
    };
  }

  removeBet(index: number) {
    this.bets.removeAt(index);
  }

  async openPaymentModal() {
    const modal = await this.modalController.create({
      component: PaymentModalComponent,
      componentProps: {
        totalAmount: this.calculateTotal()
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.confirmed) {
      this.generateTicket();
    }
  }

  calculateTotal(): number {
    return this.bets.controls.reduce((sum, bet) => sum + bet.value.amount, 0);
  }

  async generateTicket() {
    const ticket: Ticket = {
      client_id: this.ticketForm.value.client.id,
      total_amount: this.calculateTotal(),
      status: 'pending',
      payout_amount: 0,
      is_paid: false,
      created_at: new Date().toISOString()
    };

    const createdTicket = await this.ticketService.addTicket(ticket);

    const betsToSave = this.bets.controls.map(bet => ({
      ticket_id: createdTicket.id!,
      lottery_id: bet.value.lottery_id,
      schedule_id: bet.value.schedule_id,
      option_id: bet.value.option_id,
      amount: bet.value.amount,
      date: bet.value.date,
      status: bet.value.status,
      created_at: bet.value.created_at,
      type: bet.value.type,
      multiplier: bet.value.multiplier,
      payout_amount: 0,
      is_paid: false
    }));

    for (const bet of betsToSave) {
      await this.betService.addBet(bet);
    }

    this.ticketForm.reset();
    this.bets.clear();

    const alert = await this.alertController.create({
      header: 'Venta Registrada',
      message: 'El ticket y sus apuestas han sido guardados exitosamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async openDatePicker() {
    const modal = await this.modalController.create({
      component: DatePickerModalComponent,
      componentProps: { selectedDate: this.bet.date }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.confirmed) {
      this.bet.date = data.date;
    }
  }
}
