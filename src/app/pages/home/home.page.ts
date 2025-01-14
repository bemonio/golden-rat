import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  betType: string | null = null;
  betOption: string | null = null;
  betAmount: number | null = null;
  betHistory: { type: string; option: string; amount: number }[] = [];
  maxBetAmount: number = 100; // Límite máximo para las apuestas

  constructor(private alertController: AlertController) {}

  async placeBet() {
    if (this.betAmount && this.betAmount > this.maxBetAmount) {
      this.showAlert(
        'Monto Excedido',
        `El monto máximo permitido es $${this.maxBetAmount}.`
      );
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Apuesta',
      message: `¿Estás seguro de que deseas apostar $${this.betAmount} a ${this.betOption}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.addBetToHistory();
          },
        },
      ],
    });

    await alert.present();
  }

  addBetToHistory() {
    if (this.betType && this.betOption && this.betAmount) {
      this.betHistory.push({
        type: this.betType,
        option: this.betOption,
        amount: this.betAmount,
      });

      this.clearFields();
    }
  }

  clearFields() {
    this.betType = null;
    this.betOption = null;
    this.betAmount = null;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  ionViewWillEnter() {
    const savedMaxBet = localStorage.getItem('maxBetAmount');
    if (savedMaxBet) {
      this.maxBetAmount = parseInt(savedMaxBet, 10);
    }
  }    
}
