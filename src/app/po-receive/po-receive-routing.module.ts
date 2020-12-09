import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoReceivePage } from './po-receive.page';

const routes: Routes = [
  {
    path: '',
    component: PoReceivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoReceivePageRoutingModule {}
