import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DatePickerModalComponent } from './datepicker_modal.component';

@NgModule({
  declarations: [DatePickerModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [DatePickerModalComponent]
})
export class DatePickerModalModule {}
