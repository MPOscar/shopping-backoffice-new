import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { User } from '../../models/users';
import { UsersService } from '../../services/users.service';
//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedGroupMessageKey = 'Updated Group Message';

@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditUserComponent implements AfterViewInit, CanDeactivateMixin {

  data: User;

  validationErrors: ValidationErrors;

  users: Array<User>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  userId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public usersService: UsersService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit(){
    this.userId = this.activatedRoute.snapshot.data.userId;
  }
  ngAfterViewInit() {
    this.getUser();
  }

  getUser() {
    this.usersService.getUser(this.userId).subscribe(response => {
      this.data = response.data;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  submit(data: User) {
    this.updateStyle(data);
  }

  cancel() {
    this.close();
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  updateStyle(data: User) {
    this.usersService.patchUser(data).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedGroupMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });
  }
}
