import { Component, AfterViewInit, Inject, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { SocialConfiguration } from '../../models/social-configuration';
import { SocialNetworksFormComponent } from '../social-networks-form/social-networks-form.component';
import { SocialNetworksService } from '../../services/social-networks.service';
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
  selector: 'edit-social-networks',
  templateUrl: './edit-social-networks.component.html',
  styleUrls: ['./edit-social-networks.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditSocialNetworksComponent implements AfterViewInit, CanDeactivateMixin {

  @ViewChild('SocialNetworksFormComponent') socialNetworksFormComponent: SocialNetworksFormComponent;

  data: SocialConfiguration = {
    socialInstagram: 'socialInstagram',
    socialFacebook: 'socialFacebook',
    socialTwitter: 'socialTwitter'
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

  socialInstagram: boolean = false;
  socialFacebook: boolean = false;
  socialTwitter: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public socialNetworksService: SocialNetworksService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditSocialNetworksComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
  }

  ngOnInit() {
    this.getBlog();
  }
  ngAfterViewInit() {

  }

  getBlog() {
    this.socialNetworksService.getSocialNetworks('config_social_instagram').subscribe(response => {
      this.data.socialInstagram = response.data.value;
      this.socialInstagram = true;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )

    this.socialNetworksService.getSocialNetworks('config_social_facebook').subscribe(response => {
      this.data.socialFacebook = response.data.value;
      this.socialFacebook = true;

    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )

    this.socialNetworksService.getSocialNetworks('config_social_twitter').subscribe(response => {
      this.data.socialTwitter = response.data.value;
      this.socialTwitter = true;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  submit(data: SocialConfiguration) {
    this.updateSocialConfiguration(data);
  }



  cancel() {
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  updateSocialConfiguration(data: SocialConfiguration) {
    let instagram = {
      value: data.socialInstagram
    }
    let facebook = {
      value: data.socialFacebook
    }
    let twittter = {
      value: data.socialTwitter
    }
    this.socialNetworksService.putSocialNetworks('config_social_instagram', instagram).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedPrivacyMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });

    this.socialNetworksService.putSocialNetworks('config_social_facebook', facebook).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedPrivacyMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });

    this.socialNetworksService.putSocialNetworks('config_social_twitter', twittter).subscribe(response => {
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
