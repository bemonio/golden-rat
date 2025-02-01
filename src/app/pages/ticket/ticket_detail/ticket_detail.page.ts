import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../../services/ticket.service';
import { BetService } from '../../../services/bet.service';
import { ClientService } from '../../../services/client.service';
import { LotteryService } from '../../../services/lottery.service';
import { LotteryScheduleService } from '../../../services/lottery_schedule.service';
import { LotteryOptionService } from '../../../services/lottery_option.service';
import { Ticket } from '../../../interfaces/ticket.interface';
import { Bet } from '../../../interfaces/bet.interface';
import { Client } from '../../../interfaces/client.interface';
import { Lottery } from '../../../interfaces/lottery.interface';
import { LotterySchedule } from '../../../interfaces/lottery_schedule.interface';
import { LotteryOption } from '../../../interfaces/lottery_option.interface';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket_detail.page.html',
  styleUrls: ['./ticket_detail.page.scss'],
})
export class TicketDetailPage implements OnInit {
  mode: 'view' | 'edit' = 'view';
  ticketId: number = 0;
  ticketForm: FormGroup;
  ticket: Ticket | null = null;
  bets: Bet[] = [];
  client: Client | null = null;
  clients: Client[] = [];
  lotteries: { [key: number]: Lottery } = {};
  lotterySchedules: { [key: number]: LotterySchedule } = {};
  lotteryOptions: { [key: number]: LotteryOption } = {};
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private betService: BetService,
    private clientService: ClientService,
    private lotteryService: LotteryService,
    private lotteryScheduleService: LotteryScheduleService,
    private lotteryOptionService: LotteryOptionService
  ) {
    this.ticketForm = this.fb.group({
      client_id: [null, [Validators.required]],
      total_amount: [0, [Validators.required, Validators.min(1)]],
      status: ['pending'],
      payout_amount: [0, [Validators.required, Validators.min(0)]],
      is_paid: [false, [Validators.required]]
    });
  }

  async ngOnInit() {
    await this.loadTicketData();
  }

  async ionViewWillEnter() {
    await this.loadTicketData();
  }

  async loadTicketData() {
    this.isLoading = true;
    try {
      this.clients = await this.clientService.getAllClients();

      const idParam = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.url[0].path === 'add') {
        this.mode = 'edit';
      } else if (idParam) {
        this.ticketId = Number(idParam);
        this.mode = this.route.snapshot.url[1].path as 'view' | 'edit';
        this.ticket = (await this.ticketService.getTicketById(this.ticketId)) ?? null;
      }

      if (this.ticket) {
        this.bets = await this.betService.getBetsByTicketId(this.ticketId);
        this.client = (await this.clientService.getClientById(this.ticket?.client_id ?? 0)) ?? null;
        this.loadTicketForm();

        const lotteryIds = [...new Set(this.bets.map(bet => bet.lottery_id))];
        const scheduleIds = [...new Set(this.bets.map(bet => bet.schedule_id))];
        const optionIds = [...new Set(this.bets.map(bet => bet.option_id))];

        const [lotteriesArray, schedulesArray, optionsArray] = await Promise.all([
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

        this.lotterySchedules = schedulesArray
          .filter((cur): cur is { id: number; schedule: LotterySchedule } => cur !== null)
          .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.schedule }), {} as { [key: number]: LotterySchedule });

        this.lotteryOptions = optionsArray
          .filter((cur): cur is { id: number; option: LotteryOption } => cur !== null)
          .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.option }), {} as { [key: number]: LotteryOption });
      }
    } catch (error) {
      console.error('Error loading ticket data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  loadTicketForm() {
    if (this.ticket) {
      this.ticketForm.patchValue(this.ticket);
    }
  }

  async saveTicket() {
    if (this.ticketForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const ticketData = this.ticketForm.value;

    try {
      if (this.ticketId) {
        await this.ticketService.updateTicket({ id: this.ticketId, ...ticketData });
      } else {
        const createdTicket = await this.ticketService.addTicket(ticketData, []);
        if (createdTicket.id !== undefined) {
          this.ticketId = createdTicket.id;
        } else {
          console.error('El objeto creado no contiene un ID.');
          alert('Hubo un problema al crear el ticket. Por favor, intenta de nuevo.');
          return;
        }
      }
      await this.markWinningBetsAsPaid();

      this.router.navigate(['/ticket']);
    } catch (error) {
      console.error('Error saving ticket:', error);
      alert('Error al guardar el ticket.');
    }
  }

  getLotteryName(id: number): string {
    return this.lotteries[id]?.name || 'Desconocida';
  }

  getScheduleTime(id: number): string {
    return this.lotterySchedules[id]?.time || 'N/A';
  }

  getOptionName(id: number): string {
    return this.lotteryOptions[id]?.name || 'N/A';
  }

  async markWinningBetsAsPaid() {
    if (!this.ticket) return;

    try {
      const ticketId = this.ticket?.id ?? 0;
      const ticketBets = await this.betService.getBetsByTicketId(ticketId);

      const winningBets = ticketBets.filter(bet => bet.status === 'winner');

      for (const bet of winningBets) {
        bet.is_paid = true;
        await this.betService.updateBet(bet);
      }

      console.log(`Apuestas ganadoras del Ticket #${this.ticket.id} han sido marcadas como pagadas.`);
    } catch (error) {
      console.error('Error al actualizar apuestas ganadoras:', error);
    }
  }
}
