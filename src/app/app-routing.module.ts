import { DatenschutzComponent } from './shared/components/footer/datenschutz/datenschutz.component';
import { ImpressumComponent } from './shared/components/footer/impressum/impressum.component';
import { AuthGuard } from './auth/auth.gard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'play',
    loadChildren: () => import('./play/play.module').then((m) => m.PlayModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'pw-reset',
    loadChildren: () =>
      import('./pw-reset/pw-reset.module').then((m) => m.PwResetModule),
  },
  {
    path: 'games',
    loadChildren: () =>
      import('./games/games.module').then((m) => m.GamesModule),
    canActivate: [AuthGuard],
  },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
