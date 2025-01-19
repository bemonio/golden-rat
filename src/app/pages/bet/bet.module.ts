import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { BetListPage } from './bet_list/bet_list.page';
import { BetDetailPage } from './bet_detail/bet_detail.page';
import { PipeModule } from 'src/app/pipes/pipe.module';

const routes: Routes = [
  { path: '', component: BetListPage },
  { path: 'add', component: BetDetailPage },
  { path: ':id/view', component: BetDetailPage },
  { path: ':id/edit', component: BetDetailPage },
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
    BetListPage,
    BetDetailPage
  ],
})
export class BetModule { }