import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ClientService } from '../../../services/client.service';
import { Client } from 'src/app/interfaces/client.interface';

@Component({
  selector: 'app-client-list',
  templateUrl: './client_list.page.html',
  styleUrls: ['./client_list.page.scss'],
})
export class ClientListPage implements OnInit {
  clients: Client[] = [];
  searchQuery = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private clientScheduleService: ClientService
  ) {}

  ngOnInit() {
    this.loadClient();
  }

  ionViewWillEnter() {
    this.loadClient();
  }

  async loadClient() {
    this.clients = await this.clientScheduleService.getAllClients();
  }

  search(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  addClient() {
    this.router.navigate(['/client/add']);
  }

  editClient(id: number) {
    this.router.navigate([`/client/${id}/edit`]);
  }

  viewClient(id: number) {
    this.router.navigate([`/client/${id}/view`]);
  }

  async deleteClient(id: number) {
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
            await this.clientScheduleService.deleteClient(id);
            await this.loadClient();
          },
        },
      ],
    });

    await alert.present();
  }
}
