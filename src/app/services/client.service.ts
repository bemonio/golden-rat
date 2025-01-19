import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Client } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private storeName = 'clients';

  constructor(private dataService: DataService) {}

  async getClientById(id: number): Promise<Client | undefined> {
    return await this.dataService.getById(this.storeName, id);
  }

  async getAllClients(): Promise<Client[]> {
    return await this.dataService.getAll(this.storeName);
  }

  async addClient(client: Client): Promise<Client> {
    return await this.dataService.add(this.storeName, client);
  }

  async updateClient(client: Client): Promise<void> {
    await this.dataService.update(this.storeName, client);
  }

  async deleteClient(id: number): Promise<void> {
    await this.dataService.delete(this.storeName, id);
  }
}
