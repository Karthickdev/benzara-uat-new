import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsipPage } from './reportsip.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsipPageRoutingModule {}
