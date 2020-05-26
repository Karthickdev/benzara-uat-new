import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BolscanPage } from './bolscan.page';

const routes: Routes = [
  {
    path: '',
    component: BolscanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BolscanPageRoutingModule {}
