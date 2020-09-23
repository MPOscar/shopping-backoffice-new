import { Component, Inject, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Collection } from '../../models/collection';
import { CollectionsService } from '../../services/collections.service';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';

const errorKey = 'Error';

const savedUserMessageKey = 'Saved User Message';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewCollectionComponent implements OnInit, CanDeactivateMixin {

  data: Collection = {
    name: '',
    brand: ''
  };

  // brands: Array<Brand>;
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
    public dialogRef: MatDialogRef<NewCollectionComponent>,
    public activatedRoute: ActivatedRoute,
    public collectionsService: CollectionsService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
  }

  ngOnInit() {
  }

  submit(data: Collection) {
    this.createCollection(data);
  }

  cancel() {
    this.close();
  }

  close(id?: string) {
    this.dialogRef.close(id);
  }

  createCollection(collectionData: Collection) {
    if (collectionData.faces && collectionData.faces.length > 0) {
      for (const face of collectionData.faces) {
        // const face = collectionData.faces[position];
        const subscription$ = this.imagesService.postImage(face.file).subscribe(response => {
          collectionData.imgUrl = response.data.url;
          this.collectionsService.postCollection(collectionData).subscribe((response: any) => {
            this.unsavedChanges = false;
            this.close(response.data.id);
            this.toastr.success(savedUserMessageKey);
          },
            (error: HandledError) => {
              this.errorHandlingService.handleUiError(errorKey, error, 'collection');
              this.validationErrors = error.formErrors;
            });
        },
          (error: HandledError) => {
            this.errorHandlingService.handleUiError(errorKey, error);
            this.validationErrors = error.formErrors;
          });
      }
    } else {
      this.collectionsService.postCollection(collectionData).subscribe((response: any) => {
        this.unsavedChanges = false;
        this.close(response.data.id);
        this.toastr.success(savedUserMessageKey);
      },
        (error: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, error, 'collection');
          this.validationErrors = error.formErrors;
        });
    }
  }
}
