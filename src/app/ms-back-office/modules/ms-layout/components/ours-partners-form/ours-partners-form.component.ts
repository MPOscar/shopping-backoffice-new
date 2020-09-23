import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators, NgForm } from '@angular/forms';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Deal } from '../../../ms-deals/models/deal';
import { DealsService } from '../../../ms-deals/services/deals.service';
import { Offer } from '../../../ms-offers/models/offer';
import { OffersService } from '../../../ms-offers/services/offers.service';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';

import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { OurPartner, Slide } from '../../models/layout';
import { LayoutService } from '../../services/layout.service';
import { ToastrService } from 'src/app/error-handling/services/toastr.service';

const errorKey = 'Error';

@Component({
    selector: 'ours-partners-form',
    templateUrl: './ours-partners-form.component.html',
    styleUrls: ['./ours-partners-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OursPartnersFormComponent extends BaseReactiveFormComponent<OurPartner> implements OnInit {

    displayedColumns: string[] = [
        'URL',
        'VANITY URL',
        'ACTIONS'
    ];

    faces: FormControl;

    @Input() allDeals: Array<Deal>;

    @Input() allOffers: Array<Offer>;

    @Input() allTabs: Array<OurPartner>;

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

    filtersArray: Array<any>;

    slides: Array<any> = [];

    tabLabelName = new FormControl();

    tabInfo: OurPartner;

    slideToEdit: Slide;

    editSlideBoolean = false;

    typeOfferOrDealSelectedOption: string;

    typeOfferOrDealSelectedOptionId: string;

    @ViewChild('formDirective') private formDirective: NgForm;

    constructor(public dealsService: DealsService,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        public errorHandlingService: ErrorHandlingService,
        public offersService: OffersService,
        private toastr: ToastrService,
        public layoutService: LayoutService,
        public translateService: TranslateService) {
        super(translateService);
        // setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {
        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.tabLabelName = new FormControl('', [Validators.required]);

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();

        this.tabInfo = {
            'label': '',
            'slides': [
            ]
        };
    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            shop: new FormControl('', [Validators.required]),
            offerDeal: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
        });
    }

    reloadFormGroup() {
        this.formGroup = new FormGroup({
            shop: new FormControl('', [Validators.required]),
            offerDeal: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
        });
        this.formDirective.resetForm();
    }


    submitClicked() {
        if (this.formGroup.valid) {
            if (this.editSlideBoolean) {
                this.slides.forEach(slide => {
                    if (this.slideToEdit && this.slideToEdit.id === slide.id) {
                        slide.type = this.typeOfferOrDealSelectedOption;
                        slide.entityId = this.typeOfferOrDealSelectedOptionId;
                        slide.description = this.formGroup.get('description').value;
                    }
                });
                this.reloadFormGroup();
                this.editSlideBoolean = false;
            } else {
                this.slides.push({
                    'id': this.slides.length + 1,
                    'type': this.typeOfferOrDealSelectedOption,
                    'entityId': this.typeOfferOrDealSelectedOptionId,
                    'description': this.formGroup.get('description').value,
                });
                this.reloadFormGroup();
            }

        } else {
            this.triggerValidation();
        }
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

    getReleaseName(releaseId: string) {
        return this.releases.find(release => {
            return release.id === releaseId;
        }).name;
    }

    getReleaseImage(releaseId: string) {
        return this.releases.find(release => {
            return release.id === releaseId;
        }).mainImage;
    }

    setTypeOfferOrDealSelectedOption(typeOfferDeal: string, OfferOrDealId: string) {
        this.typeOfferOrDealSelectedOption = typeOfferDeal;
        this.typeOfferOrDealSelectedOptionId = OfferOrDealId;
    }


    getImageOffer(offerId: string) {
        const offer = this.allOffers.find(offerItem => {
            return offerItem.id === offerId;
        });

        return this.releases.find(releaseItem => {
            return releaseItem.id === offer.releaseId;
        }).mainImage;
    }

    getImageDeal(dealId: string) {
        return this.allDeals.find(dealItem => {
            return dealItem.id === dealId;
        }).imgUrl;
    }

    saveTab() {
        if (!this.tabLabelName.valid) {
            this.toastr.error('You need a name for the tab', 'Error');
        } else if (this.slides.length === 0) {
            this.toastr.error('You need to add at least one slide', 'Error');
        } else if (this.formGroup.dirty) {
            this.toastr.error('You have changes to an unconfirmed slide, please do so before saving', 'Error');
        } else {
            this.tabInfo.label = this.tabLabelName.value;
            this.tabInfo.slides = this.slides;
            this.accept.emit(this.tabInfo);
        }
    }

    addNewTab() {

        this.tabInfo = {
            'label': 'New Tab',
            'slides': [
            ]
        };
        this.allTabs.push({
            'label': 'New Tab',
            'slides': [
            ]
        });

        this.tabLabelName.setValue('New Tab');
        this.slides = [];
        this.reloadFormGroup();
    }

    getTabInfo(tabId: string) {
        this.tabInfo = this.allTabs.find(tab => {
            return tab.id === tabId;
        });

        this.tabLabelName.setValue(this.tabInfo.label);

        this.slides = this.tabInfo.slides;
    }

    editSlide(slideId: string) {
        this.editSlideBoolean = true;
        this.slideToEdit = this.slides.find(slide => {
            return slide.id === slideId;
        });

        this.typeOfferOrDealSelectedOption = this.slideToEdit.type;
        this.typeOfferOrDealSelectedOptionId = this.slideToEdit.entityId;
        this.formGroup.get('description').setValue(this.slideToEdit.description);

        let shopId;

        if (this.slideToEdit.type === 'offer') {
            shopId = this.allOffers.find(offer => {
                return offer.id === this.slideToEdit.entityId;
            }).shopId;
        } else if (this.slideToEdit.type === 'deal') {
            shopId = this.allDeals.find(deal => {
                return deal.id === this.slideToEdit.entityId;
            }).shopId;
        }

        this.formGroup.get('shop').setValue(shopId);
        this.getOffersDeals(shopId, this.slideToEdit.entityId);


    }

    deleteSlide(slideId: string) {
        const slides = this.slides.filter(slide => slide.id !== slideId);
        this.slides = slides;
    }

    deleteTab() {
        if (this.tabInfo) {
            if (this.tabInfo.id) {
                this.allTabs = this.allTabs.filter(tab => {
                    return tab.id !== this.tabInfo.id;
                });
                this.tabLabelName.setValue('');
                this.reloadFormGroup();
                this.slides = [];

                this.layoutService.deleteOurPartners(this.pageId, this.tabInfo.id).subscribe(response => {

                });
                delete this.tabInfo;

            }
        }

    }
}

