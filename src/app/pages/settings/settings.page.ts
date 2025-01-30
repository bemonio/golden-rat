import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { Settings } from '../../interfaces/settings.interface';

@Component({
  selector: 'app-config',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  settingsForm: FormGroup;
  isLoading = true;

  constructor(
    private settingsService: SettingsService,
    private fb: FormBuilder
  ) {
    this.settingsForm = this.fb.group({
      max_bet_amount: [100, [Validators.required, Validators.min(1)]]
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    let savedSettings = await this.settingsService.getSettingsById(1);

    if (!savedSettings) {
      const defaultSettings: Settings = { id: 1, max_bet_amount: 100 };
      await this.settingsService.addSettings(defaultSettings);
      savedSettings = await this.settingsService.getSettingsById(1);
    }

    if (savedSettings) {
      this.settingsForm.patchValue(savedSettings);
    }

    this.isLoading = false;
  }

  async saveConfig() {
    if (this.settingsForm.invalid) return;

    const updatedSettings: Settings = {
      id: 1,
      max_bet_amount: this.settingsForm.value.max_bet_amount
    };

    const existingSettings = await this.settingsService.getSettingsById(1);
    if (existingSettings) {
      await this.settingsService.updateSettings(updatedSettings);
    } else {
      await this.settingsService.addSettings(updatedSettings);
    }
  }
}
