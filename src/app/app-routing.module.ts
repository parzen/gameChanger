import { GameEditComponent } from './game-edit/game-edit.component';
import { GamesComponent } from './games/games.component';
import { PlayComponent } from './play/play.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'play', component: PlayComponent },
  { path: 'games', component: GamesComponent },
  { path: 'game/:id', component: GameEditComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
