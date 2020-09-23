import { ChangeDetectionStrategy, Component, Input, OnInit, QueryList, ViewChild, ViewChildren, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
import { Release } from '../../../ms-releases/models/releases';
import { ShopTreeComponent } from '../../../ms-shops-tree/components/shop-tree/shop-tree.component';
import { SelectedShop } from '../../../ms-shops/models/selected-shop';
import { Shop } from '../../../ms-shops/models/shops';
//
import { Offer } from '../../models/offer';
import { OfferFormMultipleComponent } from '../offer-form-multiple/offer-form-multiple.component';
import { ShopsService } from '../../../ms-shops/services/shops.service';
import { Country } from '../../../ms-shops/models/country';



@Component({
    selector: 'offer-form-new',
    templateUrl: './offer-form-new.component.html',
    styleUrls: ['./offer-form-new.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfferFormNewComponent implements OnInit {

    @Input() customized: boolean;

    data: Offer = {
        name: '',
        description: '',
        raffle: false,
        releaseId: ''
    };

    @Input() releases: Array<Release>;

    @Input() releaseId: string;

    @Input() shops: Array<Shop>;

    @Input() shopId: string;
    @Input() validationErrors: ValidationErrors;

    @Input() releaseForm = false;

    @ViewChild(ShopTreeComponent) tree: ShopTreeComponent;

    @ViewChildren(OfferFormMultipleComponent) formList !: QueryList<OfferFormMultipleComponent>;

    @Output() accept = new EventEmitter<Offer[]>();
    @Output() cancel = new EventEmitter<any>();

    selectedShopTree: Array<SelectedShop>;

    shopsToShow: Array<Shop> = [];

    @Input() offerList: Array<Offer>;

    isOffersPage = false;

    // steps
    isLinear = true;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    countriesForShipping: Array<Country> = [];

    constructor(
        public formBuilder: FormBuilder,
        public shopsService: ShopsService,
        private _formBuilder: FormBuilder,
        translateService: TranslateService) {
    }

    ngOnInit() {
        const sub = this.shopsService.getShopCountries().subscribe(response => {
            this.countriesForShipping = response.data;
        });
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
          });
          this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
          });
    }

    shopSelectedToOffers() {
        this.isOffersPage = true;
        this.selectedShopTree =  this.tree.getAllSelectedShops();
        this.selectedShops(this.selectedShopTree);
    }

    backToTree() {
        this.isOffersPage = false;
    }

    selectedShops(selectedShops: SelectedShop[]) {
        this.shopsToShow = [];
        if (selectedShops) {
            this.shops.forEach(shop => {
                const selected = selectedShops.find(s => s.shopId === shop.id);
                if (selected && shop.type === 'virtual') {
                    shop.hasLink = (Boolean)(selected.linkText && selected.linkUrl);
                    this.shopsToShow.push(shop);
                }
            });
        }
    }

    selectionChange($event) {
    }

    submitClicked() {
        this.formList.forEach(element => {
            element.submitClicked();
        });
        this.accept.emit(this.offerList);
    }

    formDataResponce(data: Offer) {
        this.offerList = [...this.offerList, data];
    }

    cancelClicked() {
        this.cancel.emit();
    }
}
