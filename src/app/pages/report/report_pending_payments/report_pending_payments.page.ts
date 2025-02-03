import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../../../interfaces/ticket.interface';

@Component({
  selector: 'app-report-pending-payments',
  templateUrl: './report_pending_payments.page.html',
  styleUrls: ['./report_pending_payments.page.scss']
})
export class ReportPendingPaymentsPage implements OnInit {
  pendingPayments: Ticket[] = [];

  constructor(private ticketService: TicketService) {}

  async ngOnInit() {
    await this.loadPendingPayments();
  }

  async loadPendingPayments() {
    const tickets = await this.ticketService.getAllTickets();
    this.pendingPayments = tickets.filter(ticket => ticket.status === 'winner' && !ticket.is_paid);
  }

  async markAsPaid(ticket: Ticket) {
    ticket.is_paid = true;
    await this.ticketService.updateTicket(ticket);
    this.pendingPayments = this.pendingPayments.filter(t => t.id !== ticket.id);
  }
}
