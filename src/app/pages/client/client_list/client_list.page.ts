import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
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
  isLoading = false; // Variable de carga

  constructor(
    private router: Router,
    private alertController: AlertController,
    private clientService: ClientService,
    private loadingController: LoadingController // Importamos LoadingController
  ) {}

  async ngOnInit() {
    await this.loadClients();
  }

  async ionViewWillEnter() {
    await this.loadClients();
  }

  async loadClients() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    this.clients = await this.clientService.getAllClients();

    this.isLoading = false;
    await loading.dismiss();
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
            await this.clientService.deleteClient(id);
            await this.loadClients();
          },
        },
      ],
    });

    await alert.present();
  }
}
