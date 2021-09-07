import { ResponseResetComponent } from './response/response-reset.component';
import { RequestResetComponent } from './request/request-reset.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'request-reset-password', component: RequestResetComponent },
  { path: 'response-reset-password/:token', component: ResponseResetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PwResetRoutingModule {}
