import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  maxBetAmount: number = 100;

  constructor(private router: Router) {}

  saveConfig() {
    localStorage.setItem('maxBetAmount', this.maxBetAmount.toString());
    this.router.navigate(['/home']);
  }

  ionViewWillEnter() {
    const savedMaxBet = localStorage.getItem('maxBetAmount');
    if (savedMaxBet) {
      this.maxBetAmount = parseInt(savedMaxBet, 10);
    }
  }
}
