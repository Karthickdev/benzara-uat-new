import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BolscanningPage } from './bolscanning.page';

const routes: Routes = [
  {
    path: '',
    component: BolscanningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BolscanningPageRoutingModule {}
