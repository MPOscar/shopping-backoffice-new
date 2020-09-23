import { Component } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { User } from '../../models/users';
import { UsersService } from '../../services/users.service';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';

const errorKey = 'Error';

const savedUserMessageKey = 'Saved User Message';

@Component({
  selector: 'new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewUserComponent implements CanDeactivateMixin {

  data: User = {
    firstName: "",
    email: "" ,
  };

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;


  validationErrors: ValidationErrors;

  constructor(
    public activatedRoute: ActivatedRoute,
    public usersService: UsersService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialog: MatDialog) {
  }

  submit(data: User) {
    this.createUser(data);
  }

  cancel() {
    //this.close.emit();TODO
    this.close();
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  createUser(data: User) {

    this.usersService.postUser(data).subscribe(response => {
      this.unsavedChanges = false;
      //this.close.emit();TODO
      this.close();
      this.toastr.success(savedUserMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error, 'user');
        this.validationErrors = error.formErrors;
      });
  }
}
