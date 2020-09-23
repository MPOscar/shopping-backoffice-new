import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
//
import { EditReleaseModel, Release, ReleaseImage } from '../../models/releases';
import { ReleaseService } from '../../services/releases.service';
import { ReleaseImagesService } from '../../services/releases-images.service';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
//import { setTranslations } from 'ngx-translate';
//import { TRANSLATIONS } from './i18n/edit-case-form.component.translations';
import { ConfirmDialogData } from '../../../../../ui/modules/confirm-dialog/models/confirm-dialog-data';
import { PropertyCase } from '../../models/property-case';
import { ImageCardEditActionDirective } from '../../../../../ui/modules/images-card/directives/images-card-edit-actions.directive';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { COLORS, Color } from '../../models/color';
import { Currency, CURRENCY } from '../../../ms-shops/models/currency';
import { GENDERS, Gender } from '../../models/gender';
import { Collection } from '../../../ms-collections/models/collection';
import { NewOfferComponent } from '../../../ms-offers/components/new-offer/new-offer.component';
import { OffersService } from "../../../ms-offers/services/offers.service";
import { Offer, OffersListResponse } from "../../../ms-offers/models/offer";
import { Brand } from '../../../ms-brands/models/brand';
import { BrandsService } from '../../../ms-brands/services/brands.service';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';
import { StylesService } from '../../../ms-style/services/styles.service';


const errorKey = 'Error';

@Component({
  selector: 'see-release',
  templateUrl: './see-release.component.html',
  styleUrls: ['./see-release.component.scss'],
})
export class SeeReleaseComponent extends BaseReactiveFormComponent<Release> implements AfterViewInit, OnInit {

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

  modalRef: MatDialogRef<ConfirmDialogComponent | NewOfferComponent>;

  principal: Face;

  @Input() collections: Array<Collection>;

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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  offersList: Subscription;

  offers: Array<Offer> = [];

  totalLength: number = 0;

  selectedBrand = new FormControl();

  notScheduleFlag: boolean;

  currency: Currency[] = CURRENCY;

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
    translateService: TranslateService,
    public dialogRef: MatDialogRef<SeeReleaseComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    super(translateService);
    //setTranslations(this.translateService, TRANSLATIONS);
  }

  ngOnInit() {
    this.shops = this.dialogData.shops;
    this.collections = this.dialogData.collections;

    this.validationErrorMessages = [
      {
        type: 'required',
        key: 'Required Field',
        params: null,
        translation: ''
      }
    ];

    this.dialogData.imageList.forEach((image) => {
      if (image.imgUrl === this.dialogData.data.mainImage) {
        this.principal = image;
      }
    });

    this.createFormGroup();

    this.releasesService.getRelease(this.dialogData.id).subscribe(response => {
      this.data = response.data;

      if (this.data.mainImage) {
        this.dialogData.imageList.forEach((image) => {
          image.fileName = "";
          if (image.imgUrl === this.data.mainImage) {
            image.mainImage = true;
          }
        });
      }
      //this.dialogData.data.faces = this.imageList;

    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));


  }

  ngAfterViewInit() {
  }

  createFormGroup() {

    this.notScheduleFlag = this.dialogData.data.releaseDate ? false : true;
    this.dialogData.data.faces = this.dialogData.imageList;
    this.faces = this.formBuilder.control(this.dialogData.imageList);
    this.formGroup = this.formBuilder.group({
      faces: this.faces,
      name: new FormControl(this.dialogData.data.name, [Validators.required]),
      sku: new FormControl(this.dialogData.data.sku),
      description: new FormControl(this.dialogData.data.description),
      styleId: new FormControl(this.dialogData.data.styleId),
      collectionId: new FormControl(this.dialogData.data.collectionId),
      children: new FormControl(this.dialogData.data.children),
      gender: new FormControl(this.dialogData.data.gender),
      price: new FormControl(this.dialogData.data.price),
      color: new FormControl(this.dialogData.data.color ? this.dialogData.data.color.split(',') : this.dialogData.data.color),
      hot: new FormControl(this.dialogData.data.hot),
      releaseDate: new FormControl(this.dialogData.data.releaseDate),
      supplierColor: new FormControl(this.dialogData.data.supplierColor),
      notSchedule: new FormControl(this.notScheduleFlag),
      customized: new FormControl(this.dialogData.data.customized),
      currency: new FormControl(this.dialogData.data.currency),
    });
  }

  onDeleteFace(face: Face) {
    if (face.id) {
      this.releaseImagesService.deleteReleaseImage(this.data.id, face.id).subscribe(response => {
      },
        (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));

    }
  }

  submitClicked() {
    if (this.formGroup.valid) {
      let id = this.data.id;
      this.data = this.formGroup.value;
      this.data.id = id;
      this.data.notSchedule = this.data.releaseDate ? false : true;
      try {
        this.data.color = this.data.color.join();
      }
      catch{ }
      this.accept.emit(this.data);
    } else {
      this.triggerValidation();
    }
  }

  MakeANewOffer() {
    this.modalRef = this.dialog.open(NewOfferComponent, {
      height: '90%',
      width: '90%',
      panelClass: 'no-padding-dialog',
      data: {
        brands: this.brands,
        shops: this.shops,
        collections: this.collections,
        releaseId: this.releaseId,
        customized: this.formGroup.get('customized').value,
      }
    });
  }

  getShop(id: string) {
    try {
      return this.shops.find(shop => {
        return shop.id === id;
      }).name;
    }
    catch (err) {
      return;
    }
  }

  selectStyle(brandId: string) {
    this.stylesService.getAllStyles().subscribe((response) => {
      if (brandId) {
        this.styles = response.filter(style => {
          return style.brand === brandId;
        });
      }
      else {
        this.styles = response;
      }
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

  close() {
    this.dialogRef.close();
  }

}
