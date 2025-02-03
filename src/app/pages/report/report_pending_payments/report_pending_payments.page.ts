import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
import { ClientService } from '../../../services/client.service';
import { Ticket } from '../../../interfaces/ticket.interface';
import { Client } from '../../../interfaces/client.interface';

@Component({
  selector: 'app-report-pending-payments',
  templateUrl: './report_pending_payments.page.html',
  styleUrls: ['./report_pending_payments.page.scss']
})
export class ReportPendingPaymentsPage implements OnInit {
  pendingPayments: (Ticket & { clientName?: string })[] = [];

  constructor(private ticketService: TicketService, private clientService: ClientService) {}

  async ngOnInit() {
    await this.loadPendingPayments();
  }

  async loadPendingPayments() {
    const tickets = await this.ticketService.getAllTickets();
    const clients = await this.clientService.getAllClients();

    this.pendingPayments = tickets
      .filter(ticket => ticket.status === 'winner' && !ticket.is_paid)
      .map(ticket => ({
        ...ticket,
        clientName: clients.find(client => client.id === ticket.client_id)?.name || 'Desconocido'
      }));
  }

  async markAsPaid(ticket: Ticket) {
    ticket.is_paid = true;
    await this.ticketService.updateTicket(ticket);
    this.pendingPayments = this.pendingPayments.filter(t => t.id !== ticket.id);
  }
}
