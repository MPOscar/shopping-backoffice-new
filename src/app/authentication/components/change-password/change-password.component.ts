import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
//
import { MatSnackBar } from '@angular/material/snack-bar';
//
import { AuthService } from '../../services/auth.service';
import { ChangePassword } from '../../models/change-password';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';
import { ErrorHandlingService } from '../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../error-handling/models/handled-error';
import { TranslateService } from '@ngx-translate/core';
// import { TRANSLATIONS } from './i18n/change-password.component.translations';
import { CanDeactivateMixin } from '../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../ui/helpers/mixin-decorator';
import { ToastrService } from '../../../error-handling/services/toastr.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

const errorTitleKey = '@c/authentication/ChangePasswordComponent/ErrorTitle';

const updatedPasswordMessageKey = '@c/authentication/ChangePasswordComponent/Updated Password Message';

@Mixin([CanDeactivateMixin])
@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent implements CanDeactivateMixin {
  data = {
    old_password: '',
    password: '',
    confirmPassword: ''
  };

  @ViewChild(ChangePasswordFormComponent) formComponent;

  validationErrors: ValidationErrors;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'ChangePasswordRouteComponent/No';

  okBtnKey = 'ChangePasswordRouteComponent/Yes';

  saveTitleKey = 'ChangePasswordRouteComponent/Discard Title';

  saveMessageKey = 'ChangePasswordRouteComponent/Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  // end

  @Output() close = new EventEmitter();

  @Input() passwordSize: number;

  @Input() uppercase: number;

  @Input() lowercase: number;

  @Input() specialCharsCount: number;

  @Input() digitsCount: number;

  constructor(private authService: AuthService,
              public dialog: MatDialog,
              private errorHandlingService: ErrorHandlingService,
              private translateService: TranslateService,
              public snackBar: MatSnackBar,
              public toastTr: ToastrService) {
    //setTranslations(this.translateService, TRANSLATIONS);
  }

  submit(data: ChangePassword) {
    this.changePassword(data);
  }

  private changePassword(data: ChangePassword) {
    this.authService.changePassword(data.old_password, data.password).subscribe(
      () => {
        this.unsavedChanges = false;
        this.translateService.get(updatedPasswordMessageKey).subscribe(value =>
        this.toastTr.success(value)
      );
        this.close.emit();
      },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorTitleKey, error);
        this.validationErrors = error.formErrors;
      }
    );
  }

  cancel() {
    this.close.emit();
  }
}
