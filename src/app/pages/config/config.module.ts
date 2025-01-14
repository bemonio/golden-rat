
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ConfigPage } from './config.page';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConfigPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ConfigPage }])
  ]
})
export class ConfigPageModule { }
