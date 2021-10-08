import { FlattenModule } from './shared/pipes/flatten.module';
import { ErrorInterceptor } from './shared/services/error/error-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { GamesModule } from './games/games.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ImpressumComponent } from './shared/components/footer/impressum/impressum.component';
import { DatenschutzComponent } from './shared/components/footer/datenschutz/datenschutz.component';
import Rollbar from 'rollbar';

const rollbarConfig = {
  accessToken: 'fcb6eb7dcf8b4c8caa627787d1bfc1a7',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    ConfirmDialogComponent,
    FooterComponent,
    ImpressumComponent,
    DatenschutzComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    HttpClientModule,
    GamesModule,
    ReactiveFormsModule,
    FlattenModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RollbarService, useFactory: rollbarFactory },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
