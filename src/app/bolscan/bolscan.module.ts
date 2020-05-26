import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BolscanPageRoutingModule } from './bolscan-routing.module';

import { BolscanPage } from './bolscan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BolscanPageRoutingModule
  ],
  declarations: [BolscanPage]
})
export class BolscanPageModule {}
