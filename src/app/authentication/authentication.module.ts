import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
//
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
//
/*import {
  AppHeaderModule,
  AskBeforeRefreshModule,
  CapsLockModule,
  CustomSnackbarModule,
  ErrorMessagesModule,
  InputFocusModule,
  SmsImageModule,
  SpinnerIndicator200Module,
} from '@c/ui';*/
import { AskBeforeRefreshModule } from '../ui/modules/ask-before-refresh/ask-before-refresh.module';
import { CapsLockModule } from '../ui/modules/caps-lock/caps-lock.module';
import {  } from '../ui/modules/spinner-indicator-200/spinner-indicator-200.module';
import { ErrorMessagesModule } from '../ui/modules/error-messages/error-messages.module';
import { ErrorHandlingModule } from '../error-handling/error-handling.module';
import { ConfigModule } from '../config/config.module';
import { HttpRequestIndicatorModule } from '../http-request-indicator/http-request-indicator.module';
import { NgrxModule } from '../ngrx/ngrx.module';
/*import { NgxTranslateModule } from '@c/ngx-translate';
import { ValidationModule } from '@c/validation';*/
//
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ManageSessionComponent } from './components/manage-session/manage-session.component';
import { TestComponent } from './components/test/test.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // InputFocusModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    // ToastrModule,
    TranslateModule.forChild(),
    // AppHeaderModule,
    AskBeforeRefreshModule,
    CapsLockModule,
    // CustomSnackbarModule,
    ConfigModule,
    ErrorHandlingModule,
    ErrorMessagesModule,
    // InputFocusModule,
    HttpRequestIndicatorModule,
    NgrxModule,
    // NgxTranslateModule,
    // SmsImageModule,
    // SpinnerIndicator200Module,
    // ValidationModule
  ],
  declarations: [
    ChangePasswordComponent,
    ChangePasswordFormComponent,
    LoginComponent,
    LogoutComponent,
    ManageSessionComponent,
    TestComponent
  ],
  exports: [
    ChangePasswordComponent,
    ChangePasswordFormComponent,
    LoginComponent,
    LogoutComponent,
    ManageSessionComponent,
    TestComponent
  ]
})
export class AuthenticationModule { }
