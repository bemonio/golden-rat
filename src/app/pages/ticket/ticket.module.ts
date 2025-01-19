import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { TicketListPage } from './ticket_list/ticket_list.page';
import { TicketDetailPage } from './ticket_detail/ticket_detail.page';
import { PipeModule } from 'src/app/pipes/pipe.module';

const routes: Routes = [
  { path: '', component: TicketListPage },
  { path: 'add', component: TicketDetailPage },
  { path: ':id/view', component: TicketDetailPage },
  { path: ':id/edit', component: TicketDetailPage },
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
    TicketListPage,
    TicketDetailPage
  ],
})
export class TicketModule { }