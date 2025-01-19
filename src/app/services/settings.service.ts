import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Settings } from '../interfaces/settings.interface';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private storeName = 'settings';

  constructor(private dataService: DataService) {}

  async getSettingsById(id: number): Promise<Settings | undefined> {
    return await this.dataService.getById(this.storeName, id);
  }

  async addSettings(settings: Settings): Promise<Settings> {
    return await this.dataService.add(this.storeName, settings);
  }

  async updateSettings(settings: Settings): Promise<void> {
    await this.dataService.update(this.storeName, settings);
  }

  async deleteSettings(id: number): Promise<void> {
    await this.dataService.delete(this.storeName, id);
  }
}