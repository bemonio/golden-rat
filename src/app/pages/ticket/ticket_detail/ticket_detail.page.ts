import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../../services/ticket.service';
import { BetService } from '../../../services/bet.service';
import { ClientService } from '../../../services/client.service';
import { Ticket } from 'src/app/interfaces/ticket.interface';
import { Bet } from 'src/app/interfaces/bet.interface';
import { Client } from 'src/app/interfaces/client.interface';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private betService: BetService,
    private clientService: ClientService
  ) {
    this.ticketForm = this.fb.group({
      client_id: [null, [Validators.required]],
      total_amount: [0, [Validators.required, Validators.min(1)]],
      has_winner: [false],
    });
  }

  async ngOnInit() {
    this.clients = await this.clientService.getAllClients();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.url[0].path === 'add') {
      this.mode = 'edit';
    } else if (idParam) {
      this.ticketId = Number(idParam);
      this.mode = this.route.snapshot.url[1].path as 'view' | 'edit';
      await this.loadTicketData();
    }
  }

  async loadTicketData() {
    const ticket = await this.ticketService.getTicketById(this.ticketId);
    this.ticket = ticket ?? null;

    if (this.ticket) {
      this.bets = await this.betService.getBetsByTicketId(this.ticketId);
      this.client = (await this.clientService.getClientById(this.ticket.client_id)) ?? null;
      this.loadTicketForm();
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

    this.router.navigate(['/ticket']);
  }
}
