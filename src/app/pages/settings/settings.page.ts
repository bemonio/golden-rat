import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { SettingsService } from '../../services/settings.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-config',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  settingsForm: FormGroup;
  isLoading = true;

  constructor(
    private settingsService: SettingsService,
    private dataService: DataService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.settingsForm = this.fb.group({
      max_bet_amount: [100, [Validators.required, Validators.min(1)]],
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    let savedSettings = await this.settingsService.getSettingsById(1);

    if (!savedSettings) {
      const defaultSettings = { id: 1, max_bet_amount: 100 };
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

    const updatedSettings = {
      id: 1,
      max_bet_amount: this.settingsForm.value.max_bet_amount,
    };

    const existingSettings = await this.settingsService.getSettingsById(1);
    if (existingSettings) {
      await this.settingsService.updateSettings(updatedSettings);
    } else {
      await this.settingsService.addSettings(updatedSettings);
    }
  }

  async confirmDeleteDatabase() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar la base de datos? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.deleteDatabase();
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteDatabase() {
    try {
      await this.dataService.deleteDatabase();
      const toast = await this.toastController.create({
        message: 'Base de datos eliminada correctamente.',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error('Error eliminando la base de datos:', error);
      const toast = await this.toastController.create({
        message: 'Error al eliminar la base de datos.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
