import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { Settings } from '../../interfaces/settings.interface';

@Component({
  selector: 'app-config',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  settings: Settings = { id: 1, max_bet_amount: 100 };

  constructor(
    private settingsService: SettingsService
  ) {}

  async ngOnInit() {
    let savedSettings = await this.settingsService.getSettingsById(1);

    if (!savedSettings) {
      await this.settingsService.addSettings(this.settings);
      savedSettings = await this.settingsService.getSettingsById(1);
    }

    this.settings = savedSettings || this.settings;
  }

  async saveConfig() {
    const existingSettings = await this.settingsService.getSettingsById(1);
    if (existingSettings) {
      await this.settingsService.updateSettings(this.settings);
    } else {
      await this.settingsService.addSettings(this.settings);
    }
  }
}