import { Component, AfterViewInit, OnInit, OnDestroy, Inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import {  Subscription, Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { BecomePartner } from '../../models/become-partner';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { BecomePartnerService } from '../../services/become-partner.service';
import { CanDeactivateMixin } from 'src/app/ui/helpers/component-can-deactivate';
import { Mixin } from 'src/app/ui/helpers/mixin-decorator';
import { ConfirmDialogComponent } from 'src/app/ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';

// import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedBecomePartnerMessageKey = 'Updated';

@Component({
  selector: 'edit-become-partner',
  templateUrl: './edit-become-partner.component.html',
  styleUrls: ['./edit-become-partner.component.scss']
})

@Mixin([CanDeactivateMixin])

export class EditBecomePartnerComponent implements OnInit, AfterViewInit, OnDestroy, CanDeactivateMixin {

  data: BecomePartner;

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
    public becomePartnerService: BecomePartnerService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditBecomePartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    // setTranslations(this.translate, TRANSLATIONS);
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getBecomePartner();
  }

  getBecomePartner() {
    const subGetBecomePartner = this.becomePartnerService.getBecomePartner().subscribe(response => {
        this.data = response.data;
    },
      (error: HandledError) => {
        if (error.errorCode === 404) {
          const inicData: BecomePartner = {
            value: ''
          };
          const subPutBecomePartner = this.becomePartnerService.putBecomePartner(inicData).subscribe(response => {
            this.data = response.data;

        });
        this.subscriptions.push(subPutBecomePartner);

        } else {
          this.errorHandlingService.handleUiError(errorKey, error);
        }
      }
    );

    this.subscriptions.push(subGetBecomePartner);
  }

  submit(data: BecomePartner) {
    const becomePartner = {
      value: data.value,
    };
    this.updateBecomePartner(becomePartner);
  }

  cancel() {
    this.close();
  }

  close() {
   this.dialogRef.close();
  }

  updateBecomePartner(becomePartner: BecomePartner) {
    const subPutBecomePartner = this.becomePartnerService.putBecomePartner(becomePartner).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedBecomePartnerMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });

      this.subscriptions.push(subPutBecomePartner);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
