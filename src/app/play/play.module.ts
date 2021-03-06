import { SharedModule } from './../shared/components/shared.module';
import { PlayComponent } from './play/play.component';
import { HttpClientModule } from '@angular/common/http';
import { PlayRoutingModule } from './play-routing.module';

import { AngularMaterialModule } from './../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PlayComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    PlayRoutingModule,
    HttpClientModule,
    SharedModule,
  ],
})
export class PlayModule {}
