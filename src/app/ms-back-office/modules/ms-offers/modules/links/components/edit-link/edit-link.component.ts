import { Component, AfterViewInit, Inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../../../error-handling/services/toastr.service';
import { Link } from '../../models/urls';
import { UrlsService } from '../../services/urls.service';

const errorKey = 'Error';

const updatedMessageKey = 'Updated';

@Component({
  selector: 'edit-link',
  templateUrl: './edit-link.component.html',
  styleUrls: ['./edit-link.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditLinkComponent implements AfterViewInit, CanDeactivateMixin {

  data: Link;

  validationErrors: ValidationErrors;

  Urls: Array<Link>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  urlId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditLinkComponent>,
    public urlsService: UrlsService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
  }

  ngOnInit() {
    this.urlId = this.dialogData.id;
    this.data = this.dialogData.data;
  }

  ngAfterViewInit() {
  }

  submit(data: Link) {
    this.dialogRef.close(data);
  }

  cancel() {
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  updateStyle(data: Link) {
    this.urlsService.putUrl(data).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });
  }
}
