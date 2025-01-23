import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BetService } from '../../../services/bet.service';
import { Bet } from 'src/app/interfaces/bet.interface';
import { TicketService } from '../../../services/ticket.service';
import { LotteryService } from '../../../services/lottery.service';
import { LotteryScheduleService } from '../../../services/lottery_schedule.service';
import { Lottery } from 'src/app/interfaces/lottery.interface';
import { LotterySchedule } from 'src/app/interfaces/lottery_schedule.interface';
import { Ticket } from 'src/app/interfaces/ticket.interface';

@Component({
  selector: 'app-bet-list',
  templateUrl: './bet_list.page.html',
  styleUrls: ['./bet_list.page.scss'],
})
export class BetListPage implements OnInit {
  bets: Bet[] = [];
  tickets: Ticket[] = [];
  lotteries: Lottery[] = [];
  lotterySchedules: LotterySchedule[] = [];
  searchQuery = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private betService: BetService,
    private ticketService: TicketService,
    private lotteryService: LotteryService,
    private lotteryScheduleService: LotteryScheduleService
  ) {}

  async ngOnInit() {
    await this.loadBets();
  }

  async ionViewWillEnter() {
    await this.loadBets();
  }

  async loadBets() {
    this.bets = await this.betService.getAllBets();

    const ticketIds = [...new Set(this.bets.map(bet => bet.ticket_id))];
    const lotteryIds = [...new Set(this.bets.map(bet => bet.lottery_id))];
    const scheduleIds = [...new Set(this.bets.map(bet => bet.schedule_id))];

    const [ticketsArray, lotteriesArray, schedulesArray] = await Promise.all([
      Promise.all(ticketIds.map(async id => {
        const ticket = await this.ticketService.getTicketById(id);
        return ticket ? ticket : null;
      })),
      Promise.all(lotteryIds.map(async id => {
        const lottery = await this.lotteryService.getLotteryById(id);
        return lottery ? lottery : null;
      })),
      Promise.all(scheduleIds.map(async id => {
        const schedule = await this.lotteryScheduleService.getLotteryScheduleById(id);
        return schedule ? schedule : null;
      }))
    ]);

    this.tickets = ticketsArray.filter((t): t is Ticket => t !== null);
    this.lotteries = lotteriesArray.filter((l): l is Lottery => l !== null);
    this.lotterySchedules = schedulesArray.filter((s): s is LotterySchedule => s !== null);
  }

  search(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  addBet() {
    this.router.navigate(['/bet/add']);
  }

  editBet(id: number) {
    this.router.navigate([`/bet/${id}/edit`]);
  }

  viewBet(id: number) {
    this.router.navigate([`/bet/${id}/view`]);
  }

  async deleteBet(id: number) {
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
            await this.betService.deleteBet(id);
            await this.loadBets();
          },
        },
      ],
    });

    await alert.present();
  }

  getLotteryName(lotteryId: number): string {
    return this.lotteries.find(l => l.id === lotteryId)?.name || 'Desconocida';
  }

  getScheduleTime(scheduleId: number): string {
    return this.lotterySchedules.find(s => s.id === scheduleId)?.time || 'N/A';
  }
}