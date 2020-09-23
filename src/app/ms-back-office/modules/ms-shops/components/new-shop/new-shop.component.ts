import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Observable, of, pipe, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Shop, ShopImage } from '../../models/shops';
import { ShopsService } from '../../services/shops.service';
import { ShopsImgesService } from '../../services/shops-images.service';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';

import { Face, MainImage } from '../../../../../ui/modules/images-card/models/face';
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { switchMap, catchError, concatMap, map, tap } from 'rxjs/operators';

const errorKey = 'Error';

const savedUserMessageKey = 'Saved User Message';

@Component({
    selector: 'new-shop',
    templateUrl: './new-shop.component.html',
    styleUrls: ['./new-shop.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewShopComponent implements CanDeactivateMixin, OnInit, OnDestroy {

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
    subscriptions: Subscription[] = [];

    constructor(
        public activatedRoute: ActivatedRoute,
        public shopsService: ShopsService,
        public shopsImgesService: ShopsImgesService,
        private errorHandlingService: ErrorHandlingService,
        public imagesService: ImagesService,
        public router: Router,
        private translate: TranslateService,
        private toastr: ToastrService,
        public dialog: MatDialog) {
    }

    ngOnInit() {
        this.brands = this.activatedRoute.snapshot.data.brands;
        this.categories = this.activatedRoute.snapshot.data.categories;
        this.collections = this.activatedRoute.snapshot.data.collections;
        this.shops = this.activatedRoute.snapshot.data.shops;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    submit(data: Shop) {
        this.createShop(data);
    }

    cancel() {
        this.close();
    }

    close() {
        this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
    }

    createShop(shopData: Shop) {
        if (shopData.faces) {
            this.createImages(shopData).then(() => {
                this.postShop(shopData);
            });
        } else {
            this.postShop(shopData);
        }
    }

    postShop(shopData: Shop) {
        const sub = this.shopsService.postShop(shopData).subscribe(resp => {
            this.unsavedChanges = false;
            this.close();
            this.toastr.success(savedUserMessageKey);
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error , 'shop');
                this.validationErrors = error.formErrors;
            });
        this.subscriptions.push(sub);
    }

    createImages(shopData: Shop): Promise<void[]> {
        return Promise.all(shopData.faces.map((face: any) => {
            return new Promise((resolve: (result?: void) => void, reject: (reason?: void) => void): void => {
                if (face[0].imgUrl && !face[0].file) {
                    shopData.mainImage = face[0].imgUrl;
                    resolve();
                } else if (face[0].file) {
                    const sub1 = this.imagesService.postImage(face[0].file).subscribe(response => {
                        if (face.mainImage) {
                            shopData.mainImage = response.data.url;
                        } else if (face.smallImage) {
                            shopData.smallImage = response.data.url;
                        } else if (face.headerImage) {
                            shopData.headerImage = response.data.url;
                        }
                        resolve();
                    }, (error: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, error);
                        this.validationErrors = error.formErrors;
                        reject();
                    });
                    this.subscriptions.push(sub1);
                }
            });
        }));
    }

}
