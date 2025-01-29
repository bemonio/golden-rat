import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment_modal.component.html',
  styleUrls: ['./payment_modal.component.scss']
})
export class PaymentModalComponent implements OnInit {
  @Input() totalAmount: number = 0;
  paymentForm: FormGroup;
  change: number = 0;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      amountReceived: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (!this.totalAmount) {
      this.totalAmount = 0;
    }

    // Configurar validación inicial
    this.paymentForm.get('amountReceived')?.setValidators([
      Validators.required, 
      Validators.min(this.totalAmount)
    ]);

    this.paymentForm.get('amountReceived')?.valueChanges.subscribe(value => {
      this.calculateChange(value);
    });
  }

  calculateChange(received: number) {
    this.change = (received || 0) - this.totalAmount;
  }

  async confirmPayment() {
    if (!this.paymentForm.valid) return;

    await this.modalController.dismiss({
      confirmed: true,
      amountReceived: this.paymentForm.value.amountReceived
    });
  }

  async closeModal() {
    await this.modalController.dismiss({ confirmed: false });
  }
}
