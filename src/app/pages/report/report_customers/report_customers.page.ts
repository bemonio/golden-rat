import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { TicketService } from '../../../services/ticket.service';
import { ClientService } from '../../../services/client.service';

Chart.register(...registerables);

@Component({
  selector: 'app-report-customers',
  templateUrl: './report_customers.page.html',
  styleUrls: ['./report_customers.page.scss']
})
export class ReportCustomersPage implements OnInit {
  customerData: number[] = [];
  customerLabels: string[] = [];

  constructor(private ticketService: TicketService, private clientService: ClientService) {}

  async ngOnInit() {
    await this.loadCustomerData();
    this.loadChart();
  }

  async loadCustomerData() {
    const tickets = await this.ticketService.getAllTickets();
    const customerCount: { [key: number]: number } = {};

    tickets.forEach(ticket => {
      if (!customerCount[ticket.client_id]) {
        customerCount[ticket.client_id] = 0;
      }
      customerCount[ticket.client_id] += ticket.total_amount;
    });

    const clients = await this.clientService.getAllClients();

    this.customerLabels = clients
      .filter(client => client.id !== undefined && customerCount[client.id])
      .map(client => client.name);
    this.customerData = this.customerLabels.map(clientName =>
      customerCount[clients.find(c => c.name === clientName)?.id || 0]
    );
  }

  loadChart() {
    new Chart('customerChartCanvas', {
      type: 'bar',
      data: {
        labels: this.customerLabels,
        datasets: [{
          label: 'Clientes Frecuentes',
          data: this.customerData,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4CAF50', '#E91E63']
        }]
      },
      options: { responsive: true }
    });
  }
}
