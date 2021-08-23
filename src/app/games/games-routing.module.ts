import { AuthGuard } from './../auth/auth.gard';
import { GameEditComponent } from './game-edit/game-edit.component';
import { GamesListComponent } from './games-list/games-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'list', component: GamesListComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: GameEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class GamesRoutingModule {}
