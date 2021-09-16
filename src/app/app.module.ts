import { ErrorInterceptor } from './error/error-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { GamesModule } from './games/games.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayComponent } from './play/play.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FooterComponent } from './footer/footer.component';
import { ImpressumComponent } from './footer/impressum/impressum.component';
import { DatenschutzComponent } from './footer/datenschutz/datenschutz.component';
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
    PlayComponent,
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
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RollbarService, useFactory: rollbarFactory }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
