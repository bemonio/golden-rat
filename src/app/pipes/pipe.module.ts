import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../pipes/filter.pipe';
import { FormatTimePipe } from './format_time.pipe';

@NgModule({
  declarations: [FilterPipe, FormatTimePipe],
  imports: [CommonModule],
  exports: [FilterPipe, FormatTimePipe],
})
export class PipeModule {}
