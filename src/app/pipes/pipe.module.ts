import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../pipes/filter.pipe';
import { FormatTimePipe } from './format_time.pipe';
import { StatusPipe } from './status.pipe';

@NgModule({
  declarations: [FilterPipe, FormatTimePipe, StatusPipe],
  imports: [CommonModule],
  exports: [FilterPipe, FormatTimePipe, StatusPipe],
})
export class PipeModule {}
