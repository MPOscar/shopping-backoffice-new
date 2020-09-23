import { Component, AfterViewInit, Inject, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ContactDetail } from '../../models/contact-detail';
import { ContactDetailFormComponent } from '../contact-detail-form/contact-detail-form.component';
import { ContactDetailService } from '../../services/ms-contact-detail.service';
import { Brand } from '../../../ms-brands/models/brand';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
import { Face, MainImage, State, Status } from '../../../../../ui/modules/images-card/models/face';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';

const errorKey = 'Error';

const updatedPrivacyMessageKey = 'Updated';

@Component({
  selector: 'edit-contact-detail',
  templateUrl: './edit-contact-detail.component.html',
  styleUrls: ['./edit-contact-detail.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditContactDetailComponent implements AfterViewInit, CanDeactivateMixin {

  data: ContactDetail = {
    socialInstagram: 'socialInstagram',
    socialFacebook: 'socialFacebook',
    socialTwitter: 'socialTwitter',
    workingHours: 'workingHours',
    timePeriodEnd: 'timePeriodEnd',
    timePeriodStart: 'timePeriodStart',
  };

  validationErrors: ValidationErrors;

  brands: Array<Brand>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  faceList: Array<Face> = [];

  principal: Face;

  blogId: string;

  timePeriodStart = false;
  timePeriodEnd = false;
  workingHours = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public contactDetailService: ContactDetailService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditContactDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
  }

  ngOnInit() {
    this.getContactDetails();
  }

  ngAfterViewInit() {

  }

  getContactDetails() {

    this.contactDetailService.getContactDetails('time_period_end').subscribe(response => {
      this.data.timePeriodEnd = response.data.value;
      this.timePeriodEnd = true;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    );

    this.contactDetailService.getContactDetails('time_period_start').subscribe(response => {
      this.data.timePeriodStart = response.data.value;
      this.timePeriodStart = true;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    );

    this.contactDetailService.getContactDetails('working_hours').subscribe(response => {
      this.data.workingHours = response.data.value;
      this.workingHours = true;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    );
  }

  submit(data: ContactDetail) {
    this.updateSocialConfiguration(data);
  }

  cancel() {
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  updateSocialConfiguration(data: ContactDetail) {
    const workingHours = {
      value: data.workingHours
    };
    const timePeriodEnd = {
      value: data.timePeriodEnd
    };
    const timePeriodStart = {
      value: data.timePeriodStart
    };

    this.contactDetailService.putContactDetails('working_hours', workingHours).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedPrivacyMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });

    this.contactDetailService.putContactDetails('time_period_end', timePeriodEnd).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedPrivacyMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });

    this.contactDetailService.putContactDetails('time_period_start', timePeriodStart).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedPrivacyMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });
  }

}
