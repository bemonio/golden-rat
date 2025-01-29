import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PaymentModalComponent } from './payment_modal.component';

@NgModule({
  declarations: [PaymentModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [PaymentModalComponent]
})
export class PaymentModalModule {}
