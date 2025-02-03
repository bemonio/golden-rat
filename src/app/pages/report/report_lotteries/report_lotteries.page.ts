import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { TicketService } from '../../../services/ticket.service';
import { LotteryService } from '../../../services/lottery.service';
import { BetService } from '../../../services/bet.service';
import { Bet } from 'src/app/interfaces/bet.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-report-lotteries',
  templateUrl: './report_lotteries.page.html',
  styleUrls: ['./report_lotteries.page.scss']
})
export class ReportLotteriesPage implements OnInit {
  lotteryData: number[] = [];
  lotteryLabels: string[] = [];

  constructor(
    private ticketService: TicketService,
    private lotteryService: LotteryService,
    private betService: BetService,
  ) {}

  async ngOnInit() {
    await this.loadLotteryData();
    this.loadChart();
  }

  async loadLotteryData() {
    const tickets = await this.ticketService.getAllTickets();
    const lotteryCount: { [key: number]: number } = {};

    const betPromises = tickets.map(ticket => this.betService.getBetsByTicketId(ticket.id!));
    const allBets: Bet[] = (await Promise.all(betPromises)).reduce((acc, bets) => acc.concat(bets), []);

    allBets.forEach(bet => {
      if (!lotteryCount[bet.lottery_id]) {
        lotteryCount[bet.lottery_id] = 0;
      }
      lotteryCount[bet.lottery_id] += 1;
    });

    const lotteries = await this.lotteryService.getAllLotteries();

    this.lotteryLabels = lotteries
      .filter(lottery => lottery.id !== undefined && lotteryCount[lottery.id])
      .map(lottery => lottery.name);
    this.lotteryData = this.lotteryLabels.map(lotteryName =>
      lotteryCount[lotteries.find(l => l.name === lotteryName)?.id || 0]
    );
  }

  loadChart() {
    new Chart('lotteryChartCanvas', {
      type: 'pie',
      data: {
        labels: this.lotteryLabels,
        datasets: [{
          label: 'Loterías Más Jugadas',
          data: this.lotteryData,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4CAF50', '#E91E63']
        }]
      },
      options: { responsive: true }
    });
  }
}
