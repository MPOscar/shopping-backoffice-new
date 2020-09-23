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
import { Collection } from '../../../ms-collections/models/collection';
import { Offer } from '../../../ms-offers/models/offer';
import { Deal } from '../../../ms-deals/models/deal';
import { DealsService } from '../../../ms-deals/services/deals.service';
import { OffersService } from '../../../ms-offers/services/offers.service';
import {MenuBrandsItem, Slide, Slider} from '../../models/layout';
import { LayoutService } from '../../services/layout.service';
import {MenuBrandsNewProductComponent} from '../menu-brands-new-product/menu-brands-new-product.component';
import {Style} from '../../../ms-style/models/style';
import {StylesService} from '../../../ms-style/services/styles.service';


const errorKey = 'Error';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'menu-brands-form',
    templateUrl: './menu-brands-form.component.html',
    styleUrls: ['./menu-brands-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MenuBrandsFormComponent extends BaseReactiveFormComponent<Slider> implements AfterViewInit, OnInit {

    displayedColumns: string[] = [
        'URL',
        'VANITY URL',
        'ACTIONS'
    ];

    faces: FormControl;

    @Input() allTabs: Array<MenuBrandsItem>;

    @Input() brands: Array<Brand>;

    @Input() styles: Array<Style>;

    @Input() collections: Array<Collection>;

    @Input() filters: any;

    @Input() pageId: string;

    deals: Array<Deal>;

    offers: Array<Offer>;

    image: Face;

    imgUrl: string;

    filteredCollections: Array<Collection>;
    filteredStyles: Array<Style>;

    filtersArray: Array<any>;

    slides: Array<any> = [];

    tabLabelName = new FormControl();

    Slider: Slider;

    slideToEdit: MenuBrandsItem;

    editSlideBoolean = false;

    typeOfProduct: string;

    typeOfferOrDealSelectedOptionId: string;

    display = new FormControl();

    displayOnPage = new FormControl();

    @ViewChild(ImageCardComponent) imageCardComponent: ImageCardComponent;

    @ViewChild('type') fileInput: ElementRef;

    modalRef: MatDialogRef<MenuBrandsNewProductComponent>;

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
        public errorHandlingService: ErrorHandlingService,
        public imagesService: ImagesService,
        public stylesService: StylesService,
        public layoutService: LayoutService,
        public translateService: TranslateService) {
        super(translateService);
    }

    ngOnInit() {
        this.filteredCollections = [];
        this.filteredStyles = [];

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

        this.collections.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        this.styles.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            collections: new FormControl(''),
            styles: new FormControl(''),
            faces: new FormControl(''),
            typeOfProduct: new FormControl('', ),
            product: new FormControl('', [Validators.required]),
            description: new FormControl('', ),
        });
    }

    submitClicked() {
        this.productValidForm();
        if (this.formGroup.valid) {
            this.image = this.formGroup.get('faces').value[0];
            this.addOrUpdateSlide();
            this.restValues();
        } else {
            this.triggerValidation();
        }
    }

    restValues() {
        this.product.name = '';
        this.imgUrl = '';
        this.typeOfProduct = '';
        this.setProductFlag = false;
        this.formGroup.get('faces').setValue([]);
        this.disabledDropDown = true;
        this.image = null;
        this.filteredCollections = [];
        this.filteredStyles = [];
    }

    addOrUpdateSlide() {
        if (this.editSlideBoolean) {
            this.slides.forEach(slide => {
                if (this.slideToEdit.id === slide.id) {
                    slide.entityType = this.typeOfProduct;
                    slide.entityId = this.typeOfferOrDealSelectedOptionId;
                    slide.description = this.formGroup.get('description').value;
                    slide.imgUrl = this.imgUrl ? this.imgUrl : '';
                    slide.collections = this.formGroup.get('collections').value;
                    slide.styles = this.formGroup.get('styles').value;
                }
            });
            this.editSlideBoolean = false;
        } else {
            this.slides.push({
                'id': this.slides.length + 1,
                'entityType': this.typeOfProduct,
                'entityId': this.typeOfferOrDealSelectedOptionId,
                'description': this.formGroup.get('description').value,
                'imgUrl': this.imgUrl ? this.imgUrl : '',
                'collections': this.formGroup.get('collections').value,
                'styles': this.formGroup.get('styles').value,
            });
        }
        this.createFormGroup();
        this.fileInput.nativeElement.click();
        this.imageCardComponent.initialize();
    }

    setTypeOfProduct(typeOfferDeal: string, OfferOrDealId: string) {
        this.typeOfferOrDealSelectedOptionId = OfferOrDealId;
    }

    getImageBrand(brandId: string) {
        const bran = this.brands.find(brand => {
            return brand.id === brandId;
        });

        return bran ? bran.imgUrl : '';
    }

    getCollectionName(collectionId: string) {
        const coll = this.collections.find(collection => {
            return collection.id === collectionId;
        });
        return coll ? coll.name : '';
    }

    getStyleName(styleId: string) {
        const styl = this.styles.find(style => {
            return style.id === styleId;
        });
        return styl ? styl.name : '';
    }

    getBrandName(brandId: string) {
        const bran = this.brands.find(brand => {
            return brand.id === brandId;
        });
        return bran ? bran.name : '';
    }

    saveTab() {
        this.Slider.slides = this.slides;
        this.Slider.display = this.display.value;
        this.Slider.displayOnPage = this.displayOnPage.value;
        this.accept.emit(this.Slider);
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
            this.getImageToEdit(this.slideToEdit.entityId, null);
            this.image = {
                imgUrl: this.imgUrl,
                state: State.Edited
            };
            this.imageCardComponent.initialize(this.image);
        }

        this.filterCollections(this.slideToEdit.entityId);
        this.filterStyles(this.slideToEdit.entityId);

        this.typeOfferOrDealSelectedOptionId = this.slideToEdit.entityId;
        this.formGroup.get('typeOfProduct').setValue(this.typeOfProduct);
        this.formGroup.get('product').setValue(this.typeOfferOrDealSelectedOptionId);
        this.formGroup.get('collections').setValue(this.slideToEdit.collections);
        this.formGroup.get('styles').setValue(this.slideToEdit.styles);
        this.setProductFlag = true;
    }

    filterCollections(brandId) {
        return this.filteredCollections = this.collections.filter(col => col.brand === brandId);
    }

    filterStyles(brandId) {
        return this.filteredStyles = this.styles.filter(style => style.brand === brandId);
    }

    deleteSlide(slideId: string) {
        this.editSlideBoolean = true;
        const slides = this.slides.filter(slide => {
            return slide.id !== slideId;
        });
        this.slides = slides;
    }

    moveSlide(slideId: string, step = 1) {
        this.editSlideBoolean = true;
        const index = this.slides.findIndex(slide => slide.id === slideId);
        if (index + step >= 0 && index + step < this.slides.length) {
            const element = this.slides[index];
            this.slides.splice(index, 1);
            this.slides.splice(index + step, 0, element);
        }
    }

    newProduct() {
        this.productValid = true;
        this.modalRef = this.dialog.open(MenuBrandsNewProductComponent, {
            height: '90%',
            width: '90%',
            data: {
                brands: this.brands,
                selected: this.slides.map(item => item.entityId)
            }
        });
        this.modalRef.afterClosed().subscribe((response) => {
            if (response) {
                const found = this.slides.find(item => item.entityId === response.id);
                if (found) {
                    this.editSlide(found.id);
                } else {
                    this.updateProduct(response);
                }
            }
        });
    }

    updateProduct(response: any) {
        this.setTypeOfProduct(response.type, response.id);
        this.typeOfProduct = response.type;
        this.formGroup.get('product').setValue(this.typeOfferOrDealSelectedOptionId);
        this.formGroup.get('typeOfProduct').setValue(this.typeOfProduct);
        this.formGroup.get('faces').setValue([]);
        this.formGroup.get('collections').setValue([]);
        this.formGroup.get('styles').setValue([]);
        this.disabledDropDown = false;

        this.imgUrl = this.getImageBrand(response.id);

        this.image = {
            imgUrl: this.imgUrl,
            state: State.New
        };

        this.product.id = response.id;
        this.product.type = response.type;
        this.product.name = response.name;
        this.setProductFlag = true;

        this.filterCollections(response.id);
        this.filterStyles(response.id);
    }

    getProductName(): string {
        const name: string = this.getBrandName(this.typeOfferOrDealSelectedOptionId);
        return name;
    }

    getImageToEdit(id: string, type: string) {
        this.imgUrl = this.getImageBrand(id);
    }


    productValidForm() {
        this.productValid = this.formGroup.controls.product.valid;
    }

}

