import { HttpClientModule } from '@angular/common/http';
import { GamesRoutingModule } from './games-routing.module';
import { GamesListComponent } from './games-list/games-list.component';
import { GameAddComponent } from './game-add/game-add.component';
import { GameEditComponent } from './game-edit/game-edit.component';

import { AngularMaterialModule } from './../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [GameEditComponent, GameAddComponent, GamesListComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    GamesRoutingModule,
    HttpClientModule
  ],
})
export class GamesModule {}
