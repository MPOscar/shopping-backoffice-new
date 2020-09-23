import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidationErrors, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Brand, LinkedShop } from '../../models/brand';
import { BrandsService } from '../../services/brands.service';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';
import { NewBrandComponent } from '../new-brand/new-brand.component';
import { LinkShopsBrandModalComponent } from '../../../ms-shops/components/link-shops-brand/link-shops-brand-modal.component';
import { Shop } from '../../../ms-shops/models/shops';

const errorKey = 'Error';

const savedMessageKey = 'Saved';

@Component({
    selector: 'brand-creator',
    templateUrl: './brand-creator.component.html',
    styleUrls: ['./brand-creator.component.scss']
})
@Mixin([CanDeactivateMixin])
export class BrandCreatorComponent implements CanDeactivateMixin, OnInit, OnDestroy{

    data: Brand = {
        name: "",
        description: ""
    };

    brands: Array<Brand>;

    brandId: string;

    // Begin Mixin code of the CanDeactivate class
    unsavedChanges = false;

    cancelBtnKey = 'No';

    okBtnKey = 'Yes';

    saveTitleKey = 'Discard Title';

    saveMessageKey = 'Discard Message';

    shops: Array<Shop>;

    modalRef: MatDialogRef<NewBrandComponent | LinkShopsBrandModalComponent>;

    canDeactivate: () => Observable<boolean> | boolean;

    dataChanged: () => void;

    linkedShops: Array<LinkedShop>;

    validationErrors: ValidationErrors;

    selectedBrand = new FormControl();

    subscriptions: Array<Subscription> = [];

    constructor(
        public activatedRoute: ActivatedRoute,
        public brandsService: BrandsService,
        private errorHandlingService: ErrorHandlingService,
        public router: Router,
        private translate: TranslateService,
        private toastr: ToastrService,
        public dialog: MatDialog) {
    }

    ngOnInit() {
        this.brands = this.activatedRoute.snapshot.data.brands;
        this.shops = this.activatedRoute.snapshot.data.shops;
        if (this.brands && this.brands.length > 0) {
            this.changeBrand(this.brands[0].id);
        }
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

    close() {
        this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
    }

    createBrand(data: Brand) {
        const subPostBrand = this.brandsService.postBrand(data).subscribe(response => {
            this.unsavedChanges = false;
            this.close();
            this.toastr.success(savedMessageKey);
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
                this.validationErrors = error.formErrors;
            });
        this.subscriptions.push(subPostBrand);
    }

    showModal() {
        this.modalRef = this.dialog.open(NewBrandComponent, {
            height: '90%',
            width: '90%',
            data: { brands: this.brands }
        });
        const subAfterClosed = this.modalRef.afterClosed().subscribe((brandId: string) => {
            if (brandId) {
                const subGetAllBrands = this.brandsService.getAllBrands().subscribe((response) => {
                    this.brands = response;
                    this.changeBrand(brandId);
                });
                this.subscriptions.push(subGetAllBrands);
            }
        });
        this.subscriptions.push(subAfterClosed);
    }

    linkShopsModalBrand() {
        this.modalRef = this.dialog.open(LinkShopsBrandModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                brandId: this.brandId,
                shops: this.shops,
            }
        });
        const subAfterClosed = this.modalRef.afterClosed().subscribe(() => {
            this.changeBrand(this.selectedBrand.value);
        });
        this.subscriptions.push(subAfterClosed);
    }

    isLinked(id: string) {
        let isLinked = this.linkedShops.findIndex(linkedShop => linkedShop.shopId === id) > -1;
        if (isLinked) {
            let index = this.shops.findIndex(shop => shop.id === id);
            this.shops[index].linked = true;
            this.shops[index].checked = true;
        } else {
            let index = this.shops.findIndex(shop => shop.id === id);
            this.shops[index].linked = false;
            this.shops[index].checked = false;
        }

    }

    changeBrand(brandId: string) {
        this.brandId = brandId;
        this.selectedBrand.setValue(brandId);
        this.brandsService.getBrandLinkedShops(brandId).subscribe(response => {
            this.linkedShops = response.data;
            this.shops.forEach((shop) => {
                this.isLinked(shop.id);
            });
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });
    }

    save(remove: boolean) {
        if (remove) {
            this.linkedShops = [];
        }
        this.brandsService.postBrandLinkedShops(this.brandId, this.linkedShops).subscribe(response => {
            this.toastr.success("Saved");
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });
    }

}
