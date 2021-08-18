import { GameEditComponent } from './game-edit/game-edit.component';
import { GamesListComponent } from './games-list/games-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'list', component: GamesListComponent },
  { path: 'game/:id', component: GameEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule {}
