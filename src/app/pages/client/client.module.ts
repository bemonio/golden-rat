import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { ClientListPage } from './client_list/client_list.page';
import { ClientDetailPage } from './client_detail/client_detail.page';
import { PipeModule } from 'src/app/pipes/pipe.module';

const routes: Routes = [
  { path: '', component: ClientListPage },
  { path: 'add', component: ClientDetailPage },
  { path: ':id/view', component: ClientDetailPage },
  { path: ':id/edit', component: ClientDetailPage },
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
    ClientListPage,
    ClientDetailPage
  ],
})
export class ClientModule { }