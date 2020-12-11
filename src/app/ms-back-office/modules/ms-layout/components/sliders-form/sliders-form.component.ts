import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { ImageCardComponent } from '../../../../../ui/modules/image-card/components/image-card/image-card.component';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
//
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Release } from '../../../ms-releases/models/releases';
import { Offer } from '../../../ms-offers/models/offer';
import { Deal } from '../../../ms-deals/models/deal';
import { DealsService } from '../../../ms-deals/services/deals.service';
import { OffersService } from '../../../ms-offers/services/offers.service';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';
import { Slide, Slider } from '../../models/layout';
import { LayoutService } from '../../services/layout.service';
import { SlidersNewProductComponent } from '../slider-new-product/slider-new-product.component';
import { ActivatedRoute } from '@angular/router';


const errorKey = 'Error';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'sliders-form',
    templateUrl: './sliders-form.component.html',
    styleUrls: ['./sliders-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SlidersFormComponent extends BaseReactiveFormComponent<Slider> implements AfterViewInit, OnInit {

    displayedColumns: string[] = [
        'URL',
        'VANITY URL',
        'ACTIONS'
    ];

    faces: FormControl;

    @Input() allDeals: Array<Deal>;

    @Input() allOffers: Array<Offer>;

    @Input() allTabs: Array<Slider>;

    @Input() brands: Array<Brand>;

    @Input() categories: Array<Category>;

    @Input() collections: Array<Collection>;

    @Input() filters: any;

    @Input() pageId: string;

    @Input() releases: Array<Release>;

    @Input() shops: Array<Shop>;

    @Input() styles: Array<Style>;

    deals: Array<Deal>;

    offers: Array<Offer>;

    image: Face;

    imgUrl: string;

    slides: Array<any> = [];

    tabLabelName = new FormControl();

    Slider: Slider;

    slideToEdit: Slide;

    editSlideBoolean = false;

    typeOfProduct: string;

    typeOfferOrDealSelectedOptionId: string;

    display = new FormControl();

    displayOnPage = new FormControl();

    @ViewChild(ImageCardComponent) imageCardComponent: ImageCardComponent;

    @ViewChild('type') fileInput: ElementRef;

    modalRef: MatDialogRef<SlidersNewProductComponent>;

    disabledDropDown: boolean;


    setProductFlag = false;

    productValid = true;


    product = {
        id: '',
        type: '',
        name: ''
    };

    constructor(public dealsService: DealsService,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public errorHandlingService: ErrorHandlingService,
        public imagesService: ImagesService,
        public offersService: OffersService,
        public layoutService: LayoutService,
        public translateService: TranslateService) {
        super(translateService);
    }

    ngOnInit() {
        this.shops = this.activatedRoute.snapshot.data.shops;
        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();

        this.disabledDropDown = true;

        this.Slider = {
            'label': '',
            'slides': [
            ]
        };
        this.slides = this.data.slides;
        let count = 1;
        this.slides.forEach(element => {
            element.id = count;
            count++;
        });
        this.display.setValue(this.data.display);
        this.displayOnPage.setValue(this.data.displayOnPage);
    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            faces: new FormControl(''),
            typeOfProduct: new FormControl('', [Validators.required]),
            product: new FormControl('', [Validators.required]),
            description: new FormControl(''),
        });
    }

    get descriptionControl() {return this.formGroup.get('description');}

    submitClicked() {
        this.productValidForm();
        this.descriptionControl.setValidators([Validators.required]);
        this.descriptionControl.updateValueAndValidity();
        if (this.formGroup.valid) {
            this.image = this.formGroup.get('faces').value[0];
            if (this.image) {
                if (this.image.state === 0) {
                    this.imagesService.postImage(this.image.file).subscribe(response => {
                        this.imgUrl = response.data.url;
                        this.addOrUpdateSlide();
                    },
                        (error: HandledError) => {
                            this.errorHandlingService.handleUiError(errorKey, error);
                            this.validationErrors = error.formErrors;
                        });
                } else {
                    this.addOrUpdateSlide();
                }
            } else {
                this.addOrUpdateSlide();
            }
        } else {
            this.triggerValidation();
        }
    }

    restValues() {
        this.product.name = '';
        this.imgUrl = '';
        this.typeOfProduct = '';
        this.setProductFlag = false;
        this.disabledDropDown = true;
        this.image = null;
    }

    addOrUpdateSlide() {
        if (this.editSlideBoolean) {
            this.slides.forEach(slide => {
                if (this.slideToEdit.id === slide.id) {
                    slide.entityType = this.typeOfProduct;
                    slide.entityId = this.typeOfferOrDealSelectedOptionId;
                    slide.description = this.formGroup.get('description').value;
                    slide.imgUrl = this.imgUrl ? this.imgUrl : '';
                }
            });
            this.editSlideBoolean = false;
        } else {
            this.slides.push({
                'id': this.slides.length + 1,
                'entityType': this.typeOfProduct,
                'entityId': this.typeOfferOrDealSelectedOptionId,
                'description': this.formGroup.get('description').value,
                'imgUrl': this.imgUrl ? this.imgUrl : ''
            });
        }
        this.restValues();
        this.data.displayOnPage = this.displayOnPage.value;
        this.ngOnInit();
    }

    getOffersDeals(shopId: string, selectedValue?: string) {
        this.deals = [];
        this.offers = [];
        const query = '?shopId=' + shopId;
        this.dealsService.getAllDealsBy(query).subscribe(response => {
            this.deals = response;
            if (selectedValue) {
                this.formGroup.get('offerDeal').setValue(this.slideToEdit.entityId);
            }
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        );

        this.offersService.getAllOffersBy(query).subscribe(response => {
            this.offers = response;
            if (selectedValue) {
                this.formGroup.get('offerDeal').setValue(this.slideToEdit.entityId);
            }
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        );

    }

    getReleaseImage(releaseId: string) {
        return this.releases.find(release => {
            return release.id === releaseId;
        }).mainImage;
    }

    setTypeOfProduct(typeOfferDeal: string, OfferOrDealId: string) {
        this.typeOfferOrDealSelectedOptionId = OfferOrDealId;
    }


    getImageOffer(offerId: string) {
        const offer = this.allOffers.find(offerItem => {
            return offerItem.id === offerId;
        });

        return offer ? this.releases.find(releaseItem => {
            return releaseItem.id === offer.releaseId;
        }).mainImage : null;
    }

    getImageRelease(releaseId: string) {
        return this.releases.find(release => {
            return release.id === releaseId;
        }).mainImage;
    }

    getImageCollection(collectionId: string) {
        return this.collections.find(collection => {
            return collection.id === collectionId;
        }).imgUrl;
    }

    getCollectionName(collectionId: string) {
        return this.collections.find(collection => {
            return collection.id === collectionId;
        }).name;
    }

    getReleaseName(releaseId: string) {
        return this.releases.find(release => {
            return release.id === releaseId;
        }).name;
    }

    getOfferName(offerId: string) {
        const offer = this.allOffers.find(offerItem => {
            return offerItem.id === offerId;
        });

        return offer ? this.releases.find(releaseItem => {
            return releaseItem.id === offer.releaseId;
        }).name : null;
    }

    saveTab() {
        this.Slider.slides = this.slides;
        this.Slider.display = this.display.value;
        this.Slider.displayOnPage = this.displayOnPage.value;
        this.accept.emit(this.Slider);
    }


    getTabInfo(tabId: string) {
        this.Slider = this.allTabs.find(tab => {
            return tab.id === tabId;
        });

        this.tabLabelName.setValue(this.Slider.label);

        this.slides = this.Slider.slides;
    }

    editSlide(slideId: string) {
        this.productValid = true;
        this.imageCardComponent.initialize();
        this.editSlideBoolean = true;
        this.disabledDropDown = false;
        this.slideToEdit = this.slides.find(slide => {
            return slide.id === slideId;
        });
        if (this.slideToEdit.imgUrl) {
            const face: Face = {
                imgUrl: this.slideToEdit.imgUrl,
                state: State.Edited
            };
            this.formGroup.get('faces').setValue([face]);
            this.imageCardComponent.initialize(face);
            this.imgUrl = this.slideToEdit.imgUrl;
        } else {
            this.getImageToEdit(this.slideToEdit.entityId, this.slideToEdit.entityType);
            this.image = {
                imgUrl: this.imgUrl,
                state: State.Edited
            };
            this.imageCardComponent.initialize(this.image);
        }
        this.typeOfProduct = this.slideToEdit.entityType;
        this.typeOfferOrDealSelectedOptionId = this.slideToEdit.entityId;
        this.formGroup.get('description').setValue(this.slideToEdit.description);
        this.formGroup.get('typeOfProduct').setValue(this.typeOfProduct);
        this.formGroup.get('product').setValue(this.typeOfferOrDealSelectedOptionId);
        this.setProductFlag = true;
    }

    deleteSlide(slideId: string) {
        this.editSlideBoolean = true;
        const slides = this.slides.filter(slide => {
            return slide.id !== slideId;
        });
        this.slides = slides;
    }


    newProduct() {
        this.productValid = true;
        this.modalRef = this.dialog.open(SlidersNewProductComponent, {
            height: '90%',
            width: '90%',
            data: {
                allOffers: this.allOffers,
                releases: this.releases,
                collections: this.collections,
                brands: this.brands,
                shops: this.shops,
                type: this.typeOfProduct
            }
        });
        this.modalRef.afterClosed().subscribe((responce) => {
            if (responce) {
                this.updateProduct(responce);
            }
        });
    }

    updateProduct(responce: any) {
        this.setTypeOfProduct(responce.type, responce.id);
        this.typeOfProduct = responce.type;
        this.formGroup.get('product').setValue(this.typeOfferOrDealSelectedOptionId);
        this.formGroup.get('typeOfProduct').setValue(this.typeOfProduct);
        this.formGroup.get('faces').setValue([]);
        this.disabledDropDown = false;

        if (this.typeOfProduct === 'collection') {
            this.imgUrl = this.getImageCollection(responce.id);
        } else if (this.typeOfProduct === 'offer') {
            this.imgUrl = this.getImageOffer(responce.id);
        } else if (this.typeOfProduct === 'release') {
            this.imgUrl = this.getImageRelease(responce.id);
        }

        this.image = {
            imgUrl: this.imgUrl,
            state: State.New
        };

        this.product.id = responce.id;
        this.product.type = responce.type;
        this.product.name = responce.name;
        this.setProductFlag = true;

        const element = document.getElementById('descriptive');
        element.click();
    }

    getProductName(): string {
        let name: string;
        if (this.typeOfProduct === 'collection') {
            name = this.getCollectionName(this.typeOfferOrDealSelectedOptionId);
        } else if (this.typeOfProduct === 'offer') {
            name = this.getOfferName(this.typeOfferOrDealSelectedOptionId);
        } else if (this.typeOfProduct === 'release') {
            name = this.getReleaseName(this.typeOfferOrDealSelectedOptionId);
        }
        return name;
    }

    getImageToEdit(id: string, type: string) {
        if (type === 'collection') {
            this.imgUrl = this.getImageCollection(id);
        } else if (type === 'offer') {
            this.imgUrl = this.getImageOffer(id);
        } else if (type === 'release') {
            this.imgUrl = this.getImageRelease(id);
        }
    }


    productValidForm() {
        this.productValid = this.formGroup.controls.product.valid;
    }

}

