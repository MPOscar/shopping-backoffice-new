import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { OffersService } from "../../services/offers.service";
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Offer } from '../../models/offer';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';
import { CURRENCY, Currency } from '../../../ms-shops/models/currency';
import { STATUS, Status } from '../../models/status';
import { SHIPPING, Shipping } from '../../models/shipping';
import { TIMEZONE, TimeZone } from '../../models/time-zone';

const errorKey = 'Error';

@Component({
  selector: 'see-offer',
  templateUrl: './see-offer.component.html',
  styleUrls: ['./see-offer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SeeOfferComponent extends BaseReactiveFormComponent<Offer> implements OnInit {

  currency: Currency[] = CURRENCY;

  release: FormControl;

  @Input() customized: boolean;

  @Input() releases: Array<Release>;

  @Input() releaseId: string;

  @Input() shops: Array<Shop>;

  status: Array<Status> = STATUS;

  shipping: Array<Shipping> = SHIPPING;

  timeZone: Array<TimeZone> = TIMEZONE;

  raffle: boolean;

  shop: Shop;

  @Input() shopSelected: Shop = {
    name: '',
    mainImage: ''
  };

  displayedColumns: string[] = [
    'checkbox',
    'text',
    'url',
    'actions'
  ];

  links: any[] = [{ text: "lalala", url: "url" }, { text: "lalala", url: "url" }, { text: "lalala", url: "url" }, { text: "lalala", url: "url" }, { text: "lalala", url: "url" }]

  constructor(
    public formBuilder: FormBuilder,
    translateService: TranslateService,
    public offersService: OffersService,
    public errorHandlingService: ErrorHandlingService,
    public dialogRef: MatDialogRef<SeeOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    super(translateService);
    //setTranslations(this.translateService, TRANSLATIONS);TODO
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

    this.createFormGroup();

    this.validationErrorMessages = validationsErrors;

    this.shopSelected = this.dialogData.shop;

  }

  createFormGroup() {
    this.raffle = this.dialogData.data.raffle;
    this.formGroup = new FormGroup({
      releaseId: new FormControl(this.releaseId ? this.releaseId : this.dialogData.data.releaseId, ),
      shopId: new FormControl(this.dialogData.data.shopId ),
      price: new FormControl(this.dialogData.data.price ),
      salePercentage: new FormControl(this.dialogData.data.salePercentage),
      status: new FormControl(this.dialogData.data.status ),
      shipping: new FormControl(this.dialogData.data.shipping ),
      raffle: new FormControl(this.dialogData.data.raffle.toString() ),
      currency: new FormControl(this.dialogData.data.raffle.toString() ),
      description: new FormControl(this.dialogData.data.description),
    });

  }

  submitClicked() {
    if (this.formGroup.valid) {
      //this.data.offerDate = new Date("2015/1/12");
      if (this.data.raffle === "true") {
        this.data.raffle = true;
      } else if (this.data.raffle === "false") {
        this.data.raffle = false;
      }
      this.accept.emit(this.data);
    } else {
      this.triggerValidation();
    }
  }

  changeShop(shop: Shop) {
    this.shopSelected = shop;
  }

  close() {
    this.dialogRef.close();
  }

}

