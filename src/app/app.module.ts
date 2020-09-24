import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AuthenticationModule} from './authentication/authentication.module';
import {ConfigModule} from './config/config.module';
import {ErrorHandlingModule} from './error-handling/error-handling.module';
import {HttpRequestIndicatorModule} from './http-request-indicator/http-request-indicator.module';
import {NgrxModule} from './ngrx/ngrx.module';
import {UiModule} from './ui/ui.module';
import {ValidationModule} from './validation/validation.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
  // for development
  /*return new TranslateHttpLoader(
      http,
      '/start-javascript/sb-admin-material/master/dist/assets/i18n/',
      '.json'
  );*/
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AuthenticationModule,
    ConfigModule,
    ErrorHandlingModule,
    HttpRequestIndicatorModule,
    NgrxModule,
    UiModule,
    ValidationModule,
    // DragulaModule.forRoot()
    NgxMaterialTimepickerModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
