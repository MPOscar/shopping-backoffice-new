import { Component, Inject, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Shop, ShopImage, ShopsResponse } from '../../models/shops';
import { ShopsService } from '../../services/shops.service';
import { ShopsImgesService } from '../../services/shops-images.service';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';

import { Face, MainImage } from '../../../../../ui/modules/images-card/models/face';
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';

const errorKey = 'Error';

const savedUserMessageKey = 'Saved User Message';

@Component({
    selector: 'new-shop-modal',
    templateUrl: './new-shop-modal.component.html',
    styleUrls: ['./new-shop-modal.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewShopModalComponent implements CanDeactivateMixin, OnInit {

    data: any = {
        name: ''
    };

    brands: Array<Brand>;

    categories: Array<Category>;

    collections: Array<Collection>;

    // Begin Mixin code of the CanDeactivate class
    unsavedChanges = false;

    cancelBtnKey = 'No';

    okBtnKey = 'Yes';

    saveTitleKey = 'Discard Title';

    saveMessageKey = 'Discard Message';

    shopId: string;

    modalRef: MatDialogRef<ConfirmDialogComponent>;

    shops: Array<Shop>;

    canDeactivate: () => Observable<boolean> | boolean;

    dataChanged: () => void;


    validationErrors: ValidationErrors;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<NewShopModalComponent>,
        public shopsService: ShopsService,
        public shopsImgesService: ShopsImgesService,
        private errorHandlingService: ErrorHandlingService,
        public imagesService: ImagesService,
        public router: Router,
        private translate: TranslateService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    }

    ngOnInit() {
        this.brands = this.activatedRoute.snapshot.data.brands;
        this.categories = this.activatedRoute.snapshot.data.categories;
        this.collections = this.activatedRoute.snapshot.data.collections;
        this.shops = this.activatedRoute.snapshot.data.shops;
    }

    submit(data: Shop) {
        this.createShop(data);
    }

    cancel() {
        this.dialogRef.close();
    }

    close(data?: Shop) {
        this.dialogRef.close(data);
    }

    createShop(shopData: Shop) {
        this.shopsService.postShop(shopData).subscribe((createdShop: ShopsResponse) => {
            this.shopId = createdShop.data.id;
            shopData.images = [];
            const imagesObservables = new Array<Observable<any>>();
            for (const face of shopData.faces) {
                if (face.file) {
                    if (face.mainImage === true) {
                        this.imagesService.postImage(face.file).subscribe(response => {
                            const mainImage: MainImage = {
                                mainImage: response.data.url
                            };
                        },
                            (error: HandledError) => {
                                this.errorHandlingService.handleUiError(errorKey, error);
                                this.validationErrors = error.formErrors;
                            });
                    } else {
                        const subscription$ = this.imagesService.postImage(face.file);
                        imagesObservables.push(subscription$);
                    }
                }
            }
            if (imagesObservables.length > 0) {

                forkJoin(imagesObservables).subscribe(responses => {
                    for (const response of responses) {
                        const image = new ShopImage;
                        image.imgUrl = response.data.url;
                        shopData.images = [...shopData.images, image];
                    }
                    this.unsavedChanges = false;
                    this.close(createdShop.data);
                    this.toastr.success((savedUserMessageKey));

                },
                    (error: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, error);
                        this.validationErrors = error.formErrors;
                    }
                );
            } else {
                this.close(createdShop.data);
            }
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error, 'shop');
                this.validationErrors = error.formErrors;
            });

    }

}
