import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { TicketService } from '../../../services/ticket.service';

Chart.register(...registerables);

@Component({
  selector: 'app-report-sales',
  templateUrl: './report_sales.page.html',
  styleUrls: ['./report_sales.page.scss']
})
export class ReportSalesPage implements OnInit {
  salesData: number[] = [];
  salesLabels: string[] = [];

  constructor(private ticketService: TicketService) { }

  async ngOnInit() {
    await this.loadSalesData();
    this.loadChart();
  }

  async loadSalesData() {
    const tickets = await this.ticketService.getAllTickets();
    const salesByDate: { [key: string]: number } = {};

    tickets.forEach(ticket => {
      const date = ticket.created_at ? ticket.created_at.split('T')[0] : 'Unknown Date';
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += ticket.total_amount;
    });

    this.salesLabels = Object.keys(salesByDate);
    this.salesData = Object.values(salesByDate);
  }

  loadChart() {
    new Chart('salesChartCanvas', {
      type: 'bar',
      data: {
        labels: this.salesLabels,
        datasets: [{
          label: 'Sales by Day',
          data: this.salesData,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4CAF50', '#E91E63']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } }
      }
    });
  }
}
