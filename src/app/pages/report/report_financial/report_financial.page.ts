import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { TicketService } from '../../../services/ticket.service';

Chart.register(...registerables);

@Component({
  selector: 'app-report-financial',
  templateUrl: './report_financial.page.html',
  styleUrls: ['./report_financial.page.scss']
})
export class ReportFinancialPage implements OnInit {
  totalCollected: number = 0; // Monto total cobrado
  totalPaid: number = 0; // Monto total pagado en premios
  totalDebt: number = 0; // Monto total pendiente por pagar

  constructor(private ticketService: TicketService) {}

  async ngOnInit() {
    await this.loadFinancialData();
    this.loadChart();
  }

  async loadFinancialData() {
    const tickets = await this.ticketService.getAllTickets();

    tickets.forEach(ticket => {
      if (ticket.is_paid) {
        this.totalCollected += ticket.total_amount;
        this.totalPaid += ticket.payout_amount;
      } else {
        this.totalDebt += ticket.payout_amount;
      }
    });
  }

  loadChart() {
    new Chart('financialChartCanvas', {
      type: 'doughnut',
      data: {
        labels: ['Cobrado', 'Pagado', 'Deuda'],
        datasets: [{
          label: 'Resumen Financiero',
          data: [this.totalCollected, this.totalPaid, this.totalDebt],
          backgroundColor: ['#4CAF50', '#FF6384', '#FFCE56']
        }]
      },
      options: { responsive: true }
    });
  }
}
