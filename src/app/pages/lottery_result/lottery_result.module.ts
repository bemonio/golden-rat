import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { LotteryResultListPage } from './lottery_result_list/lottery_result_list.page';
import { LotteryResultDetailPage } from './lottery_result_detail/lottery_result_detail.page';
import { PipeModule } from '../../pipes/pipe.module';
import { DatePickerModalModule } from 'src/app/components/datepicker_modal/datepicker_modal.module';

const routes: Routes = [
  { path: '', component: LotteryResultListPage },
  { path: 'add', component: LotteryResultDetailPage },
  { path: ':id/view', component: LotteryResultDetailPage },
  { path: ':id/edit', component: LotteryResultDetailPage },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipeModule,
    DatePickerModalModule
  ],
  declarations: [
    LotteryResultListPage,
    LotteryResultDetailPage
  ],
})
export class LotteryResultModule { }