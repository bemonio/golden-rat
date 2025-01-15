import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { LotteryListPage } from './lottery_list/lottery_list.page';
import { LotteryDetailPage } from './lottery_detail/lottery_detail.page';
import { FilterPipe } from '../../pipes/filter.pipe';

const routes: Routes = [
  { path: '', component: LotteryListPage },
  { path: 'add', component: LotteryDetailPage },
  { path: ':id/view', component: LotteryDetailPage },
  { path: ':id/edit', component: LotteryDetailPage },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LotteryListPage,
    LotteryDetailPage,
    FilterPipe
  ],
})
export class LotteryModule { }