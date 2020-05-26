import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BolscanningPageRoutingModule } from './bolscanning-routing.module';

import { BolscanningPage } from './bolscanning.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BolscanningPageRoutingModule
  ],
  declarations: [BolscanningPage]
})
export class BolscanningPageModule {}
