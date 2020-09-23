import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {ReplaySubject, Subject, Subscription} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { ConfigService } from '../../../../../config/services/config.service';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Brand } from '../../../ms-brands/models/brand';
import { BrandsService } from '../../../ms-brands/services/brands.service';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Currency, CURRENCY } from '../../../ms-shops/models/currency';
import { Shop } from '../../../ms-shops/models/shops';
import { COLORS, Color } from '../../models/color';
import { GENDERS, Gender } from '../../models/gender';
import { ReleaseService } from '../../services/releases.service';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { Release, ReleasesListResponse } from '../../models/releases';
import { NewOfferComponent } from '../../../ms-offers/components/new-offer/new-offer.component';
import { Style } from '../../../ms-style/models/style';
import { StylesService } from '../../../ms-style/services/styles.service';
import {takeUntil} from 'rxjs/operators';


const errorKey = 'Error';

@Component({
    selector: 'release-form',
    templateUrl: './release-form.component.html',
    styleUrls: ['./release-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReleaseFormComponent extends BaseReactiveFormComponent<Release> implements AfterViewInit, OnInit {

    currency: Currency[] = CURRENCY;

    displayedColumns: string[] = [
        'name',
        'description',
        'sku',
        'images',
        'gender',
        'hot',
        'actions',
    ];

    offers: Array<any>;

    shop: Shop;

    faces: FormControl;

    filter: FormGroup;

    genders: Gender[] = GENDERS;

    colors: Color[] = COLORS;

    @Input() brands: Array<Brand>;

    @Input() shops: Array<Shop>;

    @Input() collections: Array<Collection>;

    @Input() collectionId: string;

    @Input() styles: Array<Style>;

    @Input() styleId: string;

    @Input() copyReleaseId: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    modalRef: MatDialogRef<NewOfferComponent>;

    totalLength: number = 0;

    releasesList: Subscription;

    releases: Array<Release> = [];

    selectedBrand = new FormControl();

    notScheduleFlag: boolean;

    // filters
    protected _onDestroy = new Subject<void>();

    public collectionsFilterCtrl: FormControl = new FormControl();

    public filteredCollection: ReplaySubject<Collection[]> = new ReplaySubject<Collection[]>(1);

    public brandsFilterCtrl: FormControl = new FormControl();

    public filteredBrand: ReplaySubject<Brand[]> = new ReplaySubject<Brand[]>(1);

    public stylesFilterCtrl: FormControl = new FormControl();

    public filteredStyle: ReplaySubject<Style[]> = new ReplaySubject<Style[]>(1);

    constructor(
        public dialog: MatDialog,
        public brandsService: BrandsService,
        public configService: ConfigService,
        public errorHandlingService: ErrorHandlingService,
        private formBuilder: FormBuilder,
        public releasesService: ReleaseService,
        public stylesService: StylesService,
        translateService: TranslateService) {
        super(translateService);
    }

    ngOnInit() {
        let validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();

        // Begin observing style list changes.
        this.releasesList = this.releasesService.releasesList.subscribe((releaseList: any) => {
            this.totalLength = releaseList.dataCount;
            this.releases = releaseList.data;
            if (this.releases.length === 0 && this.totalLength > 0 && this.releasesService.previousPageSize > 0) {
                this.releasesService.previousPageIndex =
                    Math.ceil(this.totalLength / this.releasesService.previousPageSize) - 1;
                this.releasesService.reloadReleases().subscribe(response => {
                    this.releasesService.releasesList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            }
        });

        this.searchFilterSelect();
    }

    ngAfterViewInit() {
        this.loadPage();
    }

    createFormGroup() {
        this.notScheduleFlag = this.data.releaseDate ? false : true;
        this.faces = this.formBuilder.control(this.data.faces);
        this.formGroup = new FormGroup({
            faces: this.faces,
            name: new FormControl(this.data.name),
            sku: new FormControl(this.data.sku),
            description: new FormControl(this.data.description),
            styleId: new FormControl(this.data.styleId ? this.data.styleId : this.styleId),
            collectionId: new FormControl(this.data.collectionId ? this.data.collectionId : this.collectionId),
            children: new FormControl(this.data.children),
            gender: new FormControl(this.data.gender),
            price: new FormControl(this.data.price),
            priceUSD: new FormControl(this.data.priceUSD),
            priceEUR: new FormControl(this.data.priceEUR),
            priceGBP: new FormControl(this.data.priceGBP),
            color: new FormControl(this.data.color ? this.data.color.split(',') : this.data.color),
            hot: new FormControl(this.data.hot),
            createdAt: new FormControl(this.data.createdAt),
            releaseDate: new FormControl(this.data.updatedAt),
            supplierColor: new FormControl(this.data.supplierColor),
            notSchedule: new FormControl(this.notScheduleFlag),
            customized: new FormControl(this.data.customized),
            currency: new FormControl(this.data.currency),
        });


        if (this.collectionId) {
            this.getBrandByCollection();

        } else if (this.data.styleId) {
            const selectedStyle = this.styles.find(style => {
                return style.id === this.data.styleId;
            });
            this.selectedBrand.setValue(selectedStyle ? selectedStyle.brand : null);
        }

        this.selectStyles();
    }

    getBrandByCollection() {
        const collection = this.collections.find(coll => coll.id === this.collectionId);
        this.selectedBrand.setValue(collection.brand);
        this.selectedBrand.disable();
        const stylesTemp = this.styles.filter(sty => sty.brand === collection.brand);
        this.styles = stylesTemp;
    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.data = this.formGroup.value;
            this.data.notSchedule = this.data.releaseDate ? false : true;
            try {
                this.data.color = this.data.color.join();
            }
            catch{ }
            this.data.offers = this.offers;
            if ( this.data.faces && ! this.data.faces.find(face => face.mainImage) ) {
                this.data.faces[0].mainImage = true;
            }
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

    loadPage() {
    }

    showModal() {
        this.modalRef = this.dialog.open(NewOfferComponent, {
            height: '90%',
            width: '90%',
            data: { face: this.shop }
        });
    }

    selectStyles() {
        const brandId = this.selectedBrand.value;
        this.stylesService.getAllStyles().subscribe((response) => {
            if (brandId) {
                this.styles = response.filter(style => {
                    return style.brand === brandId;
                });
            } else {
                this.styles = response;
            }
            this.filteredStyle.next(this.styles.slice());
        });
    }

    selectBrand(brandId: string) {
        if (brandId) {
            this.selectedBrand.setValue(brandId);
        }

    }

    notSchedule() {
        this.notScheduleFlag = !this.notScheduleFlag;
        if (this.notScheduleFlag) {
            this.formGroup.get('releaseDate').setValue(null);
        }
    }

    dateChanged() {
        if (this.notScheduleFlag) {
            this.notScheduleFlag = !this.notScheduleFlag;
            this.formGroup.get('notSchedule').setValue(this.notScheduleFlag);
        }
    }

    updateOffers(data: any) {
        this.offers = data;
    }

    getCollectioName(id: string) {
        if (id) {
            return this.collections.find(item => {
                return item.id === id;
            }).name;
        }
    }

    searchFilterSelect() {
        this.filteredCollection.next(this.collections.slice());

        this.collectionsFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCollections();
            });

        this.filteredBrand.next(this.brands.slice());

        this.brandsFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterBrands();
            });

        this.filteredStyle.next(this.styles.slice());

        this.stylesFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterStyles();
            });
    }

    protected filterCollections() {
        if (!this.collections) {
            return;
        }
        // get the search keyword
        let search = this.collectionsFilterCtrl.value;
        if (!search) {
            this.filteredCollection.next(this.collections.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredCollection.next(
            this.collections.filter(col => col.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterBrands() {
        if (!this.brands) {
            return;
        }
        // get the search keyword
        let search = this.brandsFilterCtrl.value;
        if (!search) {
            this.filteredBrand.next(this.brands.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBrand.next(
            this.brands.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterStyles() {
        if (!this.styles) {
            return;
        }
        // get the search keyword
        let search = this.stylesFilterCtrl.value;
        if (!search) {
            this.filteredStyle.next(this.styles.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredStyle.next(
            this.styles.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
        );
    }
}

