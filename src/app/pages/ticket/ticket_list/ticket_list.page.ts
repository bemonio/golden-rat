import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from 'src/app/interfaces/ticket.interface';
import { ClientService } from '../../../services/client.service';
import { Client } from 'src/app/interfaces/client.interface';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket_list.page.html',
  styleUrls: ['./ticket_list.page.scss'],
})
export class TicketListPage implements OnInit {
  tickets: Ticket[] = [];
  clients: { [key: number]: Client } = {};
  searchQuery = '';
  isLoading = false; // Variable para controlar el estado de carga

  constructor(
    private router: Router,
    private alertController: AlertController,
    private ticketService: TicketService,
    private clientService: ClientService,
    private loadingController: LoadingController // Importamos LoadingController
  ) {}

  async ngOnInit() {
    await this.loadTickets();
  }

  async ionViewWillEnter() {
    await this.loadTickets();
  }

  async loadTickets() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    this.tickets = await this.ticketService.getAllTickets();

    const clientIds = [...new Set(this.tickets.map(ticket => ticket.client_id))];
    const clientsArray = await Promise.all(clientIds.map(async id => {
      const client = await this.clientService.getClientById(id);
      return client ? { id: client.id, client } : null;
    }));

    this.clients = clientsArray
      .filter((cur): cur is { id: number; client: Client } => cur !== null && cur.id !== undefined)
      .reduce((acc, cur) => {
        acc[cur.id] = cur.client;
        return acc;
      }, {} as { [key: number]: Client });

    this.isLoading = false;
    await loading.dismiss();
  }

  search(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  addTicket() {
    this.router.navigate(['/ticket/add']);
  }

  editTicket(id: number) {
    this.router.navigate([`/ticket/${id}/edit`]);
  }

  viewTicket(id: number) {
    this.router.navigate([`/ticket/${id}/view`]);
  }

  async deleteTicket(id: number) {
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
            await this.ticketService.deleteTicket(id);
            await this.loadTickets();
          },
        },
      ],
    });

    await alert.present();
  }
}
