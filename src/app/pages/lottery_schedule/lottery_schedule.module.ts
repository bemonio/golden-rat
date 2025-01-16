import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { LotteryScheduleListPage } from './lottery_schedule_list/lottery_schedule_list.page';
import { LotteryScheduleDetailPage } from './lottery_schedule_detail/lottery_schedule_detail.page';
import { PipeModule } from 'src/app/pipes/pipe.module';

const routes: Routes = [
  { path: '', component: LotteryScheduleListPage },
  { path: 'add', component: LotteryScheduleDetailPage },
  { path: ':id/view', component: LotteryScheduleDetailPage },
  { path: ':id/edit', component: LotteryScheduleDetailPage },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipeModule
  ],
  declarations: [
    LotteryScheduleListPage,
    LotteryScheduleDetailPage
  ],
})
export class LotterySchedulePageModule { }