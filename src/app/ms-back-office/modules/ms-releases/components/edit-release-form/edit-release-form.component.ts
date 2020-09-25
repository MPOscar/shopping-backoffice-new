import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
//
import { MatPaginator } from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {ReplaySubject, Subject, Subscription} from 'rxjs';
//
import {EditReleaseModel, Release, ReleaseImage} from '../../models/releases';
import {ReleaseService} from '../../services/releases.service';
import {ReleaseImagesService} from '../../services/releases-images.service';
import {BaseReactiveFormComponent} from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import {ConfirmDialogComponent} from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import {Face, State} from '../../../../../ui/modules/images-card/models/face';

import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogData} from '../../../../../ui/modules/confirm-dialog/models/confirm-dialog-data';
import {PropertyCase} from '../../models/property-case';
import {ImageCardEditActionDirective} from '../../../../../ui/modules/images-card/directives/images-card-edit-actions.directive';
import {ErrorHandlingService} from '../../../../../error-handling/services/error-handling.service';
import {HandledError} from '../../../../../error-handling/models/handled-error';
import {COLORS, Color} from '../../models/color';
import {Currency, CURRENCY} from '../../../ms-shops/models/currency';
import {GENDERS, Gender} from '../../models/gender';
import {Collection} from '../../../ms-collections/models/collection';
import {NewOfferComponent} from '../../../ms-offers/components/new-offer/new-offer.component';
import {OffersService} from '../../../ms-offers/services/offers.service';
import {Offer, OffersListResponse} from '../../../ms-offers/models/offer';
import {Brand} from '../../../ms-brands/models/brand';
import {BrandsService} from '../../../ms-brands/services/brands.service';
import {Shop} from '../../../ms-shops/models/shops';
import {Style} from '../../../ms-style/models/style';
import {StylesService} from '../../../ms-style/services/styles.service';
import {Category} from '../../../ms-categories/models/category';


const errorKey = 'Error';

@Component({
    selector: 'edit-release-form',
    templateUrl: './edit-release-form.component.html',
    styleUrls: ['./edit-release-form.component.scss'],
})
export class EditReleaseFormComponent extends BaseReactiveFormComponent<Release> implements AfterViewInit, OnInit {

    colors: Color[] = COLORS;

    displayedColumns: string[] = [
        'SKU',
        'COLLECTION',
        'COLOR',
        'SHOP',
        'STATUS',
        'SHIPING',
        'UPDATED',
        'ACTION'
    ];

    faces: FormControl;

    filter: FormGroup;

    genders: Gender[] = GENDERS;

    originalData: Release;

    modalRef: MatDialogRef<ConfirmDialogComponent>;

    principal: Face;

    @Input() collections: Array<Collection>;

    @Input() collectionId: string;

    @Input() caseProperties: Array<PropertyCase> = [];

    @Input() faceList: Array<Face> = [];

    @Input() imageCardEditAction: ImageCardEditActionDirective;

    @Input() imageList: Array<ReleaseImage> = [];

    @Input() overview = false;

    @Input() releaseId: string;

    @Input() offerId: string;

    @Input() uploadingImagesState;

    @Input() brands: Array<Brand>;

    @Input() styles: Array<Style>;

    @Input() shops: Array<Shop>;

    @Input() releases: Array<Release>;

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    offersList: Subscription;

    offers: Array<Offer> = [];

    totalLength = 0;

    selectedBrand = new FormControl();

    notScheduleFlag: boolean;

    currency: Currency[] = CURRENCY;

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
        public errorHandlingService: ErrorHandlingService,
        public matDialogService: MatDialog,
        public offersService: OffersService,
        private formBuilder: FormBuilder,
        public releasesService: ReleaseService,
        public releaseImagesService: ReleaseImagesService,
        public stylesService: StylesService,
        translateService: TranslateService) {
        super(translateService);
        // setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {
        this.validationErrorMessages = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.imageList.forEach((image) => {
            if (image.imgUrl === this.data.mainImage) {
                this.principal = image;
            }
        });

        this.createFormGroup();

        this.searchFilterSelect();

    }

    ngAfterViewInit() {
    }

    createFormGroup() {

        this.notScheduleFlag = this.data.releaseDate ? false : true;
        this.data.faces = this.imageList;
        this.faces = this.formBuilder.control(this.imageList);
        this.formGroup = this.formBuilder.group({
            faces: this.faces,
            name: new FormControl(this.data.name, [Validators.required]),
            sku: new FormControl(this.data.sku),
            description: new FormControl(this.data.description),
            styleId: new FormControl(this.data.styleId),
            collectionId: new FormControl(this.data.collectionId),
            children: new FormControl(this.data.children),
            gender: new FormControl(this.data.gender),
            slug: new FormControl(this.data.slug),
            price: new FormControl(this.data.price),
            priceUSD: new FormControl(this.data.priceUSD),
            priceEUR: new FormControl(this.data.priceEUR),
            priceGBP: new FormControl(this.data.priceGBP),
            color: new FormControl(this.data.color ? this.data.color.split(',') : this.data.color),
            hot: new FormControl(this.data.hot),
            releaseDate: new FormControl(this.data.releaseDate),
            createdAt: new FormControl(this.data.createdAt),
            updatedAt: new FormControl(this.data.updatedAt),
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
        this.filteredStyle.next(this.styles.slice());
        this.styles = stylesTemp;
    }

    onDeleteFace(face: Face) {
        if (face.id) {
            this.releaseImagesService.deleteReleaseImage(this.data.id, face.id).subscribe(response => {
                },
                (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));

        }
    }

    submitClicked(withUpdate = true) {
        if (this.formGroup.valid) {
            const id = this.data.id;
            this.data = this.formGroup.value;
            if (this.data.updatedAt) {
                if (!withUpdate) {
                    delete this.data.updatedAt;
                }
            }
            this.data.id = id;
            this.data.notSchedule = this.data.releaseDate ? false : true;
            try {
                this.data.color = this.data.color.join();
            } catch {
            }
            if (this.data.faces && !this.data.faces.find(face => face.mainImage)) {
                this.data.faces[0].mainImage = true;
            }
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

    getShop(id: string) {
        try {
            return this.shops.find(shop => {
                return shop.id === id;
            }).name;
        } catch (err) {
            return;
        }
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
