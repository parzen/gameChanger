import { ResponseResetComponent } from './response/response-reset.component';
import { RequestResetComponent } from './request/request-reset.component';
import { PwResetRoutingModule } from './pw-reset-routing.module';
import { AngularMaterialModule } from './../angular-material.module';
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
declarations: [
  RequestResetComponent,
  ResponseResetComponent
],
imports: [
  AngularMaterialModule,
  CommonModule,
  ReactiveFormsModule,
  PwResetRoutingModule
]
})
export class PwResetModule {}
