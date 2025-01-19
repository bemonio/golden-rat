import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BetService } from '../../../services/bet.service';
import { Bet } from 'src/app/interfaces/bet.interface';
import { TicketService } from '../../../services/ticket.service';
import { LotteryService } from '../../../services/lottery.service';

@Component({
  selector: 'app-bet-list',
  templateUrl: './bet_list.page.html',
  styleUrls: ['./bet_list.page.scss'],
})
export class BetListPage implements OnInit {
  bets: Bet[] = [];
  tickets: { [key: number]: string } = {};
  lotteries: { [key: number]: string } = {};
  searchQuery = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private betService: BetService,
    private ticketService: TicketService,
    private lotteryService: LotteryService
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

    const ticketsArray = await Promise.all(ticketIds.map(async id => {
      const ticket = await this.ticketService.getTicketById(id);
      return ticket && ticket.id !== undefined ? { id: ticket.id, name: `Ticket #${ticket.id}` } : null;
    }));

    const lotteriesArray = await Promise.all(lotteryIds.map(async id => {
      const lottery = await this.lotteryService.getLotteryById(id);
      return lottery && lottery.id !== undefined ? { id: lottery.id, name: lottery.name } : null;
    }));

    this.tickets = ticketsArray
      .filter((cur): cur is { id: number; name: string } => cur !== null && cur.id !== undefined)
      .reduce((acc, cur) => {
        acc[cur.id] = cur.name;
        return acc;
      }, {} as { [key: number]: string });

      this.lotteries = lotteriesArray
      .filter((cur): cur is { id: number; name: string } => cur !== null && cur.id !== undefined)
      .reduce((acc, cur) => {
        acc[cur.id] = cur.name;
        return acc;
      }, {} as { [key: number]: string });
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
}
