import { Component, AfterViewInit, Inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { Privacy } from '../../models/privacy';
import { PrivacyService } from '../../services/privacy.service';
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
  selector: 'edit-privacy',
  templateUrl: './edit-privacy.component.html',
  styleUrls: ['./edit-privacy.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditPrivacyComponent implements AfterViewInit, CanDeactivateMixin {

  data: Privacy;

  validationErrors: ValidationErrors;

  blogs: Array<Privacy>;

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

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public privacyService: PrivacyService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditPrivacyComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit() {
    this.blogId = this.activatedRoute.snapshot.data.blogId;
    this.brands = this.activatedRoute.snapshot.data.brands;
  }
  ngAfterViewInit() {
    this.getBlog();
  }

  getBlog() {
    this.privacyService.getPrivacy().subscribe(response => {
      this.data = response.data;

    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  submit(data: Privacy) {
    let privacy = {
      value: data.value,
    }
    this.updatePrivacy(privacy);
  }

  cancel() {
    this.close();
  }

  close() {
   this.dialogRef.close();
  }

  updatePrivacy(privacy: Privacy) {
    this.privacyService.putPrivacy(privacy).subscribe(response => {
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
