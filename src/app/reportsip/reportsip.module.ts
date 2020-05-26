import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsipPageRoutingModule } from './reportsip-routing.module';

import { ReportsipPage } from './reportsip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReportsipPageRoutingModule
  ],
  declarations: [ReportsipPage]
})
export class ReportsipPageModule {}
