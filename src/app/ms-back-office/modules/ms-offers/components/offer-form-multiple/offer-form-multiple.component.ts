import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Offer } from '../../models/offer';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';

import { STATUS, RAFFLE_STATUS, Status } from '../../models/status';
import { Subscription } from 'rxjs';
import { requiredAtLeast } from 'src/app/validation/helpers/required-at-least-validator';
import { mergeTimeIntoDateCtrl } from 'src/app/shared/utils/helpers';
import {ShippingCountries, SHIPPINGCOUNTRIES, SHIPPINGCOUNTRIESRAFFLE} from '../../../ms-shops/models/shippingCountries';
import { Country } from '../../../ms-shops/models/country';
import {TIMEZONES} from '../../models/time-zone';
;

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'offer-form-multiple',
    templateUrl: './offer-form-multiple.component.html',
    styleUrls: ['./offer-form-multiple.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfferFormMultipleComponent extends BaseReactiveFormComponent<Offer> implements AfterViewInit, OnInit, OnDestroy {

    release: FormControl;

    salePrice = new FormControl();
    salePercentage = new FormControl();
    @Input() customized: boolean;

    @Input() releases: Array<Release>;

    @Input() releaseId: string;

    @Input() releaseForm = false;


    @Input() shop: Shop;

    releaseStatus: Array<Status> = STATUS;
    raffleStatus: Array<Status> = RAFFLE_STATUS;

    // shipping: Array<Shipping> = OFFER_SHIPPING;
    shippingCountries: ShippingCountries[] = SHIPPINGCOUNTRIES;
    shippingCountriesRaffle: ShippingCountries[] = SHIPPINGCOUNTRIESRAFFLE;

    @Input() countriesForShipping: Array<Country> = [];

    timezones = TIMEZONES;

    displayedColumns: string[] = [
        'checkbox',
        'text',
        'url',
        'actions'
    ];

    links: Array<any> = [];

    subscriptions: Subscription[] = [];

    statusSelected = 'available';

    constructor(
        public formBuilder: FormBuilder,
        public translateService: TranslateService) {
        super(translateService);
        // setTranslations(this.translateService, TRANSLATIONS);TODO
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

        this.validationErrorMessages = validationsErrors;

        this.data.shipping = this.data.shipping;

        if (this.data.links) {
            this.links = this.data.links;
        } else {
            this.links = [];
        }

        this.createFormGroup();

        this.setupCtrlListeners();

        if (this.releaseId) {
            this.changePrices(this.releaseId);
        }

    }

    ngAfterViewInit() {
        this.salePrice.setValue(this.calculateSalePrice());
        // this.salePrice.disable();
        this.salePercentage.disable();
    }

    createFormGroup() {
        if (this.shop.type === 'virtual' && typeof this.shop.countries === 'string') {
            this.transformCountriesToArray();
        }

        this.formGroup = new FormGroup({
            displayWhatsNew: new FormControl(this.data.displayWhatsNew),
            timezone: new FormControl(this.data.timezone ),
            displayOnSale: new FormControl({
                value: this.data.displayOnSale,
                disabled: !this.data.id // start disabled on create mode
            }),
            prices: new FormGroup({
                priceUSD: new FormControl(this.data.priceUSD),
                priceEUR: new FormControl(this.data.priceEUR),
                priceGBP: new FormControl(this.data.priceGBP),
            }),
            raffle: new FormControl(this.data.raffle, [Validators.required]),
            releaseId: new FormControl(this.releaseId ? this.releaseId : this.data.releaseId, [Validators.required]),
            // salePercentage: new FormControl(this.data.salePercentage),
            // shopId: new FormControl(this.shopId ? this.shopId : this.data.shopId, [Validators.required]),

            shipping: new FormControl(this.shop.type === 'virtual' ? this.shop.shippingCountries : ''),
            countries: new FormControl((this.shop.type === 'virtual' && this.shop.countries) ? this.shop.countries : []),
            // shipping: new FormControl(this.data.shipping, [Validators.required]),
            status: new FormControl(this.data.id ? this.data.status : 'available', [Validators.required]),
            links: new FormControl(this.links, [Validators.required])
        });


        if (this.releaseForm && !this.releaseId) {
            this.removeReleaseIdCtrl();
        }

        if (this.data.raffle) {
            this.addRaffleTimeCtrls();
            this.removeReleaseTimeCtrls();
        } else {
            this.removeRaffleTimeCtrls();
            this.addReleaseTimeCtrls();
        }

    }

    transformCountriesToArray() {
        const countries: Array<string> = [];
        let index = 0;
        while (this.shop.countries.split(',')[index]) {
            countries.push(this.shop.countries.split(',')[index]);
            index++;
        }
        this.shop.countries = countries;
    }

    ngOnDestroy() {
        super.onDestroy();
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    updateDisplayOnSales() {
        const currStatus = this.statusCtrl.value;
        if (currStatus !== 'on_sale') {
            this.displayOnSaleCtrl.setValue(false, { emitEvent: false });
            this.displayOnSaleCtrl.disable({ emitEvent: false });
        } else {
            this.displayOnSaleCtrl.enable({ emitEvent: false });
        }
    }

    setupCtrlListeners() {

        const sub = this.formGroup.valueChanges.subscribe((value) => {
            this.salePrice.setValue(this.calculateSalePrice());
            this.updateDisplayOnSales();
        });

        const sub2 = this.raffleCtrl
            .valueChanges
            .subscribe(isRaffle => {
                this.changeStatus(null);
                if (isRaffle) {
                    this.addRaffleTimeCtrls();
                    this.removeReleaseTimeCtrls();
                } else {
                    this.removeRaffleTimeCtrls();
                    this.addReleaseTimeCtrls();
                }
            });

        if (!this.releaseForm || (this.releaseForm && this.releaseId)) {
            const sub3 = this.formGroup.get('releaseId')
                .valueChanges
                .subscribe(releaseId => {
                    if (!this.data.raffle) {
                        this.updateReleaseDateTime();
                    }
                    this.changePrices(releaseId);
                });
            this.subscriptions.push(sub3);
        }

        this.subscriptions.push(sub, sub2);
    }

    adjustPercent() {
        const value = this.salePercentage.value;
        if (value < 0) {
            this.salePercentage.setValue(0);
        }
        if (value > 100) {
            this.salePercentage.setValue(100);
        }
    }

    adjustPrices() {
        let price = this.shop.currency ? this.formGroup.get('prices').get(`price${this.shop.currency}`).value
            : this.formGroup.get('prices').get('priceEUR').value;
        if (price === undefined) {
            price = 0;
        }
        const value = this.salePrice.value;
        if (value < 0) {
            this.salePrice.setValue(0);
        }
        if (value > price) {
            this.salePrice.setValue(price);
        }
    }

    salePercentKeyPress() {
        this.adjustPercent();
        this.salePrice.setValue(this.calculateSalePrice());
        this.updateDisplayOnSales();
    }

    salePriceKeyPress() {
        this.adjustPrices();
        this.salePercentage.setValue(this.calculateSalePercent());
        this.updateDisplayOnSales();
    }

    calculateSalePrice() {
        let price = this.shop.currency ? this.formGroup.get('prices').get(`price${this.shop.currency}`).value
            : this.formGroup.get('prices').get('priceEUR').value;
        if (price === undefined) {
            price = 0;
        }
        const salePercentage = this.salePercentage.value;
        if (price > 0 && salePercentage > 0) {
            const p = price - (salePercentage * price / 100);
            return p.toFixed(2);
        }
        return null;
    }

    calculateSalePercent() {
        let price = this.shop.currency ? this.formGroup.get('prices').get(`price${this.shop.currency}`).value
            : this.formGroup.get('prices').get('priceEUR').value;
        if (price === undefined) {
            price = 0;
        }
        const salePrice = this.salePrice.value;
        if (price > 0 && salePrice > 0) {
            // const p = price - (salePercentage * price / 100);
            const salePercentage = 100 * (price - salePrice) / price;
            return salePercentage.toFixed();
        }
        return null;
    }


    changePrices(releaseId: string) {
        const selectedRelease = this.releases.find(r => r.id === releaseId);
        if (selectedRelease) {
            const priceEURCtrl = this.formGroup
                .get('prices')
                .get('priceEUR');

            const priceUSDCtrl = this.formGroup
                .get('prices')
                .get('priceUSD');

            const priceGBPCtrl = this.formGroup
                .get('prices')
                .get('priceGBP');

            if (selectedRelease.priceEUR) {
                priceEURCtrl.setValue(this.shop.currency === 'EUR' ? selectedRelease.priceEUR : null);
            }

            if (selectedRelease.priceUSD) {
                priceUSDCtrl.setValue(this.shop.currency === 'USD' ? selectedRelease.priceUSD : null);
            }

            if (selectedRelease.priceGBP) {
                priceGBPCtrl.setValue(this.shop.currency === 'GBP' ? selectedRelease.priceGBP : null);
            }
        }
    }

    changeStatusToSalePrice() {
        const statusControl = this.formGroup.get('status');
        if (this.salePrice.value && this.salePercentage.value) {
            statusControl.setValue('on_sale');
            this.changeStatus('on_sale');
            statusControl.disable();
        } else {
            statusControl.setValue('available');
            statusControl.enable();
        }
    }

    addRaffleTimeCtrls() {
        this.formGroup.addControl('raffleStart', new FormControl(this.data.raffleStart));
        this.formGroup.addControl('raffleEnd', new FormControl(this.data.raffleEnd));

        let startTime;
        let endTime;
        if (this.data.raffleStart) {
            startTime = '00:00';
            const startDate = new Date(this.data.raffleStart);
            const hrs = startDate.getUTCHours();
            const mins = startDate.getUTCMinutes();
            startTime = `${hrs}:${mins}`;
        }

        if (this.data.raffleEnd) {
            endTime = '00:00';
            const endDate = new Date(this.data.raffleEnd);
            const hrs = endDate.getUTCHours();
            const mins = endDate.getUTCMinutes();
            endTime = `${hrs}:${mins}`;
        }
        this.formGroup.addControl('raffleStartTime', new FormControl(startTime));
        this.formGroup.addControl('raffleEndTime', new FormControl(endTime));
    }

    clearTime() {
        this.formGroup.get('raffleEndTime').setValue(null);
    }

    removeRaffleTimeCtrls() {
        this.formGroup.removeControl('raffleStart');
        this.formGroup.removeControl('raffleEnd');

        this.formGroup.removeControl('raffleStartTime');
        this.formGroup.removeControl('raffleEndTime');
    }

    addReleaseTimeCtrls() {
        if (this.data.releaseTime) {
            this.formGroup.addControl('releaseTime', new FormControl(this.data.releaseTime));
            const date = new Date(this.data.releaseTime);
            const hrs = date.getUTCHours();
            const mins = date.getUTCMinutes();
            const exactTime = `${('00' + hrs).slice(-2)}:${('00' + mins).slice(-2)}`;
            this.formGroup.addControl('releaseTimeHours', new FormControl(exactTime));
        } else  {
            this.formGroup.addControl('releaseTime', new FormControl(null));
            this.formGroup.addControl('releaseTimeHours', new FormControl(null));
            this.updateReleaseDateTime();
        }
        if (this.releaseDateTimeCtrl && !this.releaseDateTimeCtrl.value) {
            this.setTimezoneDefaultsFromShop(this.shop);
        }
    }

    removeReleaseTimeCtrls() {
        this.formGroup.removeControl('releaseTime');
        this.formGroup.removeControl('releaseTimeHours');
    }

    removeReleaseIdCtrl() {
        this.formGroup.removeControl('releaseId');
    }

    submitClicked() {
        const entity = this.prepareEntity();
        if (this.formGroup.valid) {
            this.accept.emit(entity);
        } else {
            this.triggerValidation();
        }
    }
    prepareEntity(): any {
        const offerTemp: Offer = this.formGroup.value;
        if (this.releaseForm && !this.releaseId) {
            offerTemp.releaseId = '';
        }
        const entity: Offer = { id: this.data.id, ...offerTemp, shopId: this.shop.id };
        entity.status = entity.status ? entity.status : 'on_sale';

        entity.priceEUR = this.formGroup.get('prices').get('priceEUR').value;
        entity.priceUSD = this.formGroup.get('prices').get('priceUSD').value;
        entity.priceGBP = this.formGroup.get('prices').get('priceGBP').value;

        entity.salePercentage = +this.salePercentage.value;
        try {
            if (entity.countries) {
                entity.countries = entity.countries.join();
            }
        } catch { }
        // There's no datetimepicker, so in the UI the date and the time are set
        // separately. Here we are joining the values into 1 single field
        if (this.isRaffle) {
            // const raffleStartTimeCtrl = this.formGroup.get('raffleStartTime') as FormControl;
            // const raffleStartDate = this.formGroup.get('raffleStart') as FormControl;
            const raffleEndTimeCtrl = this.formGroup.get('raffleEndTime') as FormControl;
            const raffleEndDate = this.formGroup.get('raffleEnd') as FormControl;

            // if (this.statusSelected !== 'coming_soon') {
            //     raffleEndTimeCtrl.setValue(null);
            //     raffleEndDate.setValue(null);
            // }

            // entity.raffleStart = mergeTimeIntoDateCtrl(
            //     raffleStartDate, raffleStartTimeCtrl
            // );

            entity.raffleEnd = mergeTimeIntoDateCtrl(
                raffleEndDate, raffleEndTimeCtrl
            );
        } else {
            const releaseTimeCtrl = this.formGroup.get('releaseTime') as FormControl;
            const releaseTimeHrsCtrl = this.formGroup.get('releaseTimeHours') as FormControl;
            if (this.statusSelected !== 'coming_soon') {
                releaseTimeCtrl.setValue(null);
                releaseTimeHrsCtrl.setValue(null);
            }
            entity.releaseTime = mergeTimeIntoDateCtrl(
                releaseTimeCtrl, releaseTimeHrsCtrl
            );
        }

        entity.links = [];

        if (this.links) {
            this.links.forEach(element => {
                delete element.id;
                element.trackedUrl = this.shop.trackingListBaseUrl + encodeURI(element.url);
                entity.links = [...entity.links, element];
            });
        }

        if (entity.status !== 'on_sale') {
            entity.salePercentage = 0;
        }

        return entity;
    }

    // changeShop(shop: Shop) {
    //     this.shopSlected = shop;
    //     const shippingCtrl = this.formGroup.get('shipping') as FormControl
    //     const value = this.shopSlected.shippingCountries
    //     shippingCtrl.setValue(value ? value.toLowerCase() : null)
    // }

    updateLinks(links: any) {
        this.links = links;
        const linksControl = this.formGroup.get('links');
        linksControl.setValue(links);
    }

    get displayOnSaleCtrl() {
        return this.formGroup.get('displayOnSale') as FormControl;
    }

    get statusCtrl() {
        return this.formGroup.get('status') as FormControl;
    }

    get raffleCtrl() {
        return this.formGroup.get('raffle') as FormControl;
    }

    get releaseDateCtrl() {
        return this.formGroup.get('releaseTime') as FormControl;
    }

    get releaseDateTimeCtrl() {
        return this.formGroup.get('releaseTimeHours') as FormControl;
    }

    get isRaffle() {
        return this.raffleCtrl.value as boolean;
    }

    get pricesInvalid() {
        return (
            this.formGroup.get('prices').dirty &&
            this.formGroup.get('prices').hasError('requiredAtLeast')
        );
    }

    changeStatus(state: string) {
        this.statusSelected = state;
        if (state === 'on_sale') {
            this.salePercentage.setValidators([Validators.required]);
            this.salePercentage.updateValueAndValidity();
            this.salePrice.setValidators([Validators.required]);
            this.salePrice.updateValueAndValidity();
            this.salePercentage.enable();
            this.salePrice.enable();
        } else {
            this.salePercentage.setValue(0);
            this.salePrice.setValue(0);
            this.salePercentage.clearValidators();
            this.salePercentage.updateValueAndValidity();
            this.salePrice.clearValidators();
            this.salePrice.updateValueAndValidity();
            this.salePrice.disable();
            this.salePercentage.disable();
        }
        if (state === 'coming_soon' && !this.data.raffle) {
            this.updateReleaseDateTime();
        }
        this.updateDisplayOnSales();
    }

    setTimezoneDefaultsFromShop(shop: Shop) {
        if (shop.showOnRegion === 'USA') {
            this.formGroup.setControl('releaseTimeHours', new FormControl('10:00'));
            this.formGroup.setControl('timezone', new FormControl('ET'));
        } else if (shop.showOnRegion === 'Europe') {
            this.formGroup.setControl('releaseTimeHours', new FormControl('09:00'));
            this.formGroup.setControl('timezone', new FormControl('CET'));
        } else {
            this.formGroup.setControl('timezone', new FormControl('CET'));
        }
    }

    updateReleaseDateTime() {
        const releaseId = this.releaseId;
        const selectedRelease = this.releases.find(r => r.id === releaseId);
        if (selectedRelease && selectedRelease.releaseDate) {
            this.formGroup.setControl('releaseTime', new FormControl(selectedRelease.releaseDate));
            this.formGroup.setControl('releaseTimeHours', new FormControl('00:00'));
        } else {
            this.formGroup.setControl('releaseTime', new FormControl(this.data.releaseTime));
            if (this.data.releaseTime) {
                let exactTime = '00:00';
                const date = new Date(this.data.releaseTime);
                const hrs = date.getUTCHours();
                const mins = date.getUTCMinutes();
                exactTime = `${hrs}:${mins}`;
                this.formGroup.setControl('releaseTimeHours', new FormControl(exactTime));
            }
        }
    }

}
