import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { LotteryMultiplierListPage } from './lottery_multiplier_list/lottery_multiplier_list.page';
import { LotteryMultiplierDetailPage } from './lottery_multiplier_detail/lottery_multiplier_detail.page';
import { PipeModule } from '../../pipes/pipe.module';
import { DatePickerModalModule } from '../../components/datepicker_modal/datepicker_modal.module';

const routes: Routes = [
  { path: '', component: LotteryMultiplierListPage },
  { path: 'add', component: LotteryMultiplierDetailPage },
  { path: ':id/view', component: LotteryMultiplierDetailPage },
  { path: ':id/edit', component: LotteryMultiplierDetailPage },
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
    LotteryMultiplierListPage,
    LotteryMultiplierDetailPage
  ],
})
export class LotteryMultiplierModule { }