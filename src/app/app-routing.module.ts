import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./tracking/tracking.module').then( m => m.TrackingPageModule)
  },
  {
    path: 'reportsip',
    loadChildren: () => import('./reportsip/reportsip.module').then( m => m.ReportsipPageModule)
  },
  {
    path: 'bolscanning',
    loadChildren: () => import('./bolscanning/bolscanning.module').then( m => m.BolscanningPageModule)
  },
  {
    path: 'po-receive',
    loadChildren: () => import('./po-receive/po-receive.module').then( m => m.PoReceivePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
