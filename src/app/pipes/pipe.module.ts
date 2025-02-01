import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../pipes/filter.pipe';
import { FormatTimePipe } from './format_time.pipe';
import { StatusPipe } from './status.pipe';
import { PaymentStatusPipe } from './payment_status.pipe';

@NgModule({
  declarations: [FilterPipe, FormatTimePipe, StatusPipe, PaymentStatusPipe],
  imports: [CommonModule],
  exports: [FilterPipe, FormatTimePipe, StatusPipe, PaymentStatusPipe],
})
export class PipeModule {}
