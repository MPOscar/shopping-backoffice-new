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
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Brand } from '../../models/brand';
import { BrandsService } from '../../services/brands.service';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedBrandMessageKey = 'Updated';

@Component({
  selector: 'edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditBrandComponent implements AfterViewInit, CanDeactivateMixin {

  data: Brand;

  validationErrors: ValidationErrors;

  brands: Array<Brand>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard';

  saveMessageKey = 'Discard ';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  faceList: Array<Face> = [];

  principal: Face;

  brandId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public brandsService: BrandsService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit() {
    this.brandId = this.activatedRoute.snapshot.data.styleId;
  }
  ngAfterViewInit() {
    this.getBrand();
  }

  getBrand() {
    this.brandsService.getBrand(this.brandId).subscribe(response => {
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

  submit(data: Brand) {
    delete data.updatedAt;
    delete data.createdAt;
    this.updateBrand(data);
  }

  cancel() {
    this.close();
  }

  close() {
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
  }

  updateBrand(brandData: Brand) {
    if (brandData.faces) {
      for (const position in brandData.faces) {
        const face = brandData.faces[position];
        if (face.state === State.New) {
          const subscription$ = this.imagesService.postImage(face.file).subscribe(response => {
            brandData.imgUrl = response.data.url;
            this.brandsService.putBrand(brandData).subscribe(response => {
              this.unsavedChanges = false;
              this.close();
              this.toastr.success(updatedBrandMessageKey);
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
          this.brandsService.putBrand(brandData).subscribe(response => {
            this.unsavedChanges = false;
            this.close();
            this.toastr.success(updatedBrandMessageKey);
          },
            (error: HandledError) => {
              this.errorHandlingService.handleUiError(errorKey, error);
              this.validationErrors = error.formErrors;
            });
        }
      }
    } else {
      this.brandsService.putBrand(brandData).subscribe(response => {
        this.unsavedChanges = false;
        this.close();
        this.toastr.success(updatedBrandMessageKey);
      },
        (error: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, error);
          this.validationErrors = error.formErrors;
        });
    }
  }
}
