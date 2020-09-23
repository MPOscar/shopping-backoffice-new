import { Component, AfterViewInit, OnInit, OnDestroy, Inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Subscription, Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { WhoAreWe } from '../../models/who-are-we';
import { WhoAreWeService } from '../../services/who-are-we.service';
import { CanDeactivateMixin } from 'src/app/ui/helpers/component-can-deactivate';
import { Mixin } from 'src/app/ui/helpers/mixin-decorator';
import { ConfirmDialogComponent } from 'src/app/ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';

// import { setTranslations } from '@c/ngx-translate';
const errorKey = 'Error';

const updatedWhoAreWeMessageKey = 'Updated';

@Component({
  selector: 'edit-who-are-we',
  templateUrl: './edit-who-are-we.component.html',
  styleUrls: ['./edit-who-are-we.component.scss']
})

@Mixin([CanDeactivateMixin])

export class EditWhoAreWeComponent implements OnInit, AfterViewInit, OnDestroy, CanDeactivateMixin {

  data: WhoAreWe;

  validationErrors: ValidationErrors;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  subscriptions: Subscription[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public whoAreWeService: WhoAreWeService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditWhoAreWeComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    // setTranslations(this.translate, TRANSLATIONS);
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getWhoAreWe();
  }

  getWhoAreWe() {

    const subGetWhoAreWe = this.whoAreWeService.getWhoAreWe().subscribe(response => {
      this.data = response.data;
    },
      (error: HandledError) => {
        if (error.errorCode === 404) {
          const inicData: WhoAreWe = {
            value: ''
          };
          const subPutWhoAreWe = this.whoAreWeService.putWhoAreWe(inicData).subscribe(response => {
            this.data = response.data;

          });
          this.subscriptions.push(subPutWhoAreWe);
        } else {
          this.errorHandlingService.handleUiError(errorKey, error);
        }
      }
    );
    this.subscriptions.push(subGetWhoAreWe);
  }

  submit(data: WhoAreWe) {
    const whoAreWe = {
      value: data.value,
    };
    this.updateWhoAreWe(whoAreWe);
  }

  cancel() {
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  updateWhoAreWe(whoAreWe: WhoAreWe) {
    const subPutWhoAreWe = this.whoAreWeService.putWhoAreWe(whoAreWe).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedWhoAreWeMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });

    this.subscriptions.push(subPutWhoAreWe);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
