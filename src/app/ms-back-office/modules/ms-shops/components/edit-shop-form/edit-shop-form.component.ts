import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter, QueryList, ViewChildren, } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
//
import { Face } from '../../../../../ui/modules/images-card/models/face';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Shop } from '../../models/shops';
import { Brand } from '../../../ms-brands/models/brand';
import { Currency, CURRENCY } from '../../models/currency';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Country } from '../../models/country';
import { Rank, RANK } from '../../models/rank';
import { Region, REGIONS, SHOWONREGIONS } from '../../models/regions';
import { ShopsService } from '../../services/shops.service';
import { ShopsSellingStyleModalComponent } from '../shops-selling-style-modal/shops-selling-style-modal.component';
import { LinkShopsSubShopsModalComponent } from '../link-shops-subshops/link-shops-subshops-modal.component';
import { ShippingCountries, SHIPPINGCOUNTRIES } from '../../models/shippingCountries';

import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { Url } from '../../../ms-urls/models/urls';
import { Release } from '../../../ms-releases/models/releases';
import { ShopFormComponent } from '../shop-form/shop-form.component';

const errorKey = 'Error';


@Component({
    selector: 'edit-shop-form',
    templateUrl: './edit-shop-form.component.html',
    styleUrls: ['./edit-shop-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditShopFormComponent implements AfterViewInit, OnInit {

    modalRef: MatDialogRef<ShopsSellingStyleModalComponent | LinkShopsSubShopsModalComponent>;

    shop: Shop;

    @Input() data: Shop;

    @Input() brands: Array<Brand>;

    @Input() categories: Array<Category>;

    @Input() collections: Array<Collection>;

    @Input() shops: Array<Shop>;

    @Input() subShops: Array<Shop>;

    @Input() faceList: Array<Face> = [];

    @Input() shopId: string;

    @Input() dealId: string;

    @Input() releases: Array<Release>;

    @Input() validationErrors: ValidationErrors;

    @Output() accept: EventEmitter<Shop> = new EventEmitter();

    @Output() cancel: EventEmitter<Shop> = new EventEmitter();

    parentShops: Array<Shop>;

    subscriptions: Subscription[] = [];

    @ViewChild(ShopFormComponent) shopForm !: ShopFormComponent;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public errorHandlingService: ErrorHandlingService,
        private formBuilder: FormBuilder,
        public shopsService: ShopsService) {
        // setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {
        this.subShops = this.shops.filter(shop => {
            return shop.parent === this.shopId;
        });

        this.parentShops = this.shops.filter(shop => {
            return shop.isParent && shop.id !== this.shopId;
        });
        if (this.data.countries) {
            this.transformCountriesToArray();
        }
    }

    transformCountriesToArray() {
        const countries: Array<string> = [];
        let index = 0;
        while (this.data.countries.split(',')[index]) {
            countries.push(this.data.countries.split(',')[index]);
            index ++;
        }
        this.data.countries = countries;
    }

    ngAfterViewInit() {
    }

    submitClicked() {
        this.shopForm.submitClicked();
    }

    submit() {
        this.accept.emit(this.data);
    }

    showModal() {
        this.modalRef = this.dialog.open(ShopsSellingStyleModalComponent, {
            height: '800px',
            width: '60%',
            data: { face: this.shop }
        });
    }

    showLinkSubShopsModal() {
        this.modalRef = this.dialog.open(LinkShopsSubShopsModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                shopId: this.shopId,
                shops: this.shops,
            }
        });
        const sub = this.modalRef
            .afterClosed()
            .subscribe(() => {
                this.shopsService.getAllShops().subscribe((response) => {
                    this.shops = response;

                    this.subShops = this.shops.filter(shop => {
                        return shop.parent === this.shopId;
                    });

                });
            });
        this.subscriptions.push(sub);
    }

    dataChanged() {

    }

    cancelClick() {
        this.cancel.emit();
    }
}

