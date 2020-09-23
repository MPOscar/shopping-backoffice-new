import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//
import { Face, MainImage, State, Status } from '../../../../../ui/modules/images-card/models/face';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
//
import { Collection } from '../../models/collection';
import { CollectionsService } from '../../services/collections.service';
import { Brand } from '../../../ms-brands/models/brand';
import { Release } from '../../../ms-releases/models/releases';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedGroupMessageKey = 'Updated';

@Component({
  selector: 'edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditCollectionComponent implements AfterViewInit, CanDeactivateMixin {

  brands: Array<Brand>;

  data: Collection;

  validationErrors: ValidationErrors;

  collections: Array<Collection>;

  releases: Array<Release>;

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

  collectionId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public collectionsService: CollectionsService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit() {
    this.collectionId = this.activatedRoute.snapshot.data.collectionId;
    this.brands = this.activatedRoute.snapshot.data.brands;
    this.collections = this.activatedRoute.snapshot.data.collections;
    this.releases = this.activatedRoute.snapshot.data.releases;
  }
  ngAfterViewInit() {
    this.getCollection();
  }

  getCollection() {
    this.collectionsService.getCollection(this.collectionId).subscribe(response => {
      this.data = response.data;
      if (this.data.imgUrl) {
        let face: Face = {
          imgUrl: this.data.imgUrl,
        };
        this.faceList = [face];
        this.principal = face;
      }

    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  submit(data: Collection) {
    delete data.updatedAt;
    delete data.createdAt;
    this.updateCollection(data);
  }

  cancel() {
    this.close();
  }

  close() {
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
  }

  updateCollection(collectionData: Collection) {
    if (collectionData.faces) {
      for (const face of collectionData.faces) {
        if (face.state === State.New) {
          const subscription$ = this.imagesService.postImage(face.file).subscribe(response => {
            collectionData.imgUrl = response.data.url;
            this.collectionsService.putCollection(collectionData).subscribe(response => {
              this.unsavedChanges = false;
              this.close();
              this.toastr.success(updatedGroupMessageKey);
            },
              (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
                this.validationErrors = error.formErrors;
              });
          },
            (error: HandledError) => {
              this.errorHandlingService.handleUiError(errorKey, error);
              this.validationErrors = error.formErrors;
            });
        } else {
          this.collectionsService.putCollection(collectionData).subscribe(response => {
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
    } else {
      this.collectionsService.putCollection(collectionData).subscribe(response => {
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
}
