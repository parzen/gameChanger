import { SortByTitlePipe } from './../pipes/sortByTitle.pipe';
import { RouterModule } from '@angular/router';
import { FlattenModule } from './../pipes/flatten.module';
import { AngularMaterialModule } from './../../angular-material.module';
import { GamesViewComponent } from './games-view/games-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [GamesViewComponent, SortByTitlePipe],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularMaterialModule,
    FlattenModule,
    RouterModule,
  ],
  exports: [CommonModule, HttpClientModule, GamesViewComponent],
})
export class SharedModule {}
