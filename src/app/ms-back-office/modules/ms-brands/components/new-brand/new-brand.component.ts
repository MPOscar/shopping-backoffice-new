import { Component, Inject, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Brand } from '../../models/brand';
import { BrandsService } from '../../services/brands.service';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';

const errorKey = 'Error';

const savedMessageKey = 'Saved';

@Component({
    selector: 'new-brand',
    templateUrl: './new-brand.component.html',
    styleUrls: ['./new-brand.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewBrandComponent implements CanDeactivateMixin, OnDestroy {

    data: Brand = {
        name: '',
        description: '',
        imgUrl: '',
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

    subscriptions: Array<Subscription> = [];

    constructor(
        public dialogRef: MatDialogRef<NewBrandComponent>,
        public activatedRoute: ActivatedRoute,
        public brandsService: BrandsService,
        private errorHandlingService: ErrorHandlingService,
        public imagesService: ImagesService,
        public router: Router,
        private toastr: ToastrService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public datas: Brand
    ) {
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    submit(data: Brand) {
        this.createBrand(data);
    }

    cancel() {
        this.close();
    }

    close(brandId?: string) {
        this.dialogRef.close(brandId);
    }

    createBrand(brandData: Brand) {
        if (brandData.faces && brandData.faces.length > 0) {
            for (const face of brandData.faces) {
                // const face = brandData.faces[position];
                const subPostImage = this.imagesService.postImage(face.file).subscribe(response => {
                    brandData.imgUrl = response.data.url;
                    const subPostBrand = this.brandsService.postBrand(brandData).subscribe(response => {
                        this.unsavedChanges = false;
                        this.close(response.data.id);
                        this.toastr.success(savedMessageKey);
                    },
                        (error: HandledError) => {
                            this.errorHandlingService.handleUiError(errorKey, error, 'brand');
                            this.validationErrors = error.formErrors;
                        });
                    this.subscriptions.push(subPostImage);
                },
                    (error: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, error);
                        this.validationErrors = error.formErrors;
                    });
                this.subscriptions.push(subPostImage);
            }
        } else {
            const subPostBrand = this.brandsService.postBrand(brandData).subscribe(response => {
                this.unsavedChanges = false;
                this.close(response.data.id);
                this.toastr.success(savedMessageKey);
            },
                (error: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, error, 'brand');
                    this.validationErrors = error.formErrors;
                });
            this.subscriptions.push(subPostBrand);
        }

    }
}
