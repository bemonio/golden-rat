
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PosPage } from './pos.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PipeModule } from '../../pipes/pipe.module';
import { PaymentModalModule } from '../../components/payment_modal/payment_modal.module';
import { DatePickerModalModule } from '../../components/datepicker_modal/datepicker_modal.module';

@NgModule({
  declarations: [PosPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: PosPage }]),
    PipeModule,
    PaymentModalModule,
    DatePickerModalModule
  ]
})
export class PosModule { }
