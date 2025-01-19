
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { BetPage } from './bet.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/pipes/pipe.module';

@NgModule({
  declarations: [BetPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: BetPage }]),
    PipeModule
  ]
})
export class BetModule { }
