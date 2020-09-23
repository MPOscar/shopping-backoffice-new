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
import { ShopsService } from '../../../ms-shops/services/shops.service';
import {TIMEZONES} from '../../models/time-zone';

@Component({
    selector: 'offer-form',
    templateUrl: './offer-form.component.html',
    styleUrls: ['./offer-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfferFormComponent extends BaseReactiveFormComponent<Offer> implements AfterViewInit, OnInit, OnDestroy {

    release: FormControl;

    salePrice = new FormControl();
    salePercentage = new FormControl();

    @Input() customized: boolean;

    @Input() releases: Array<Release>;

    @Input() releaseId: string;

    @Input() releaseForm = false;

    @Input() shops: Array<Shop>;

    @Input() shopId: string;

    releaseStatus: Array<Status> = STATUS;
    raffleStatus: Array<Status> = RAFFLE_STATUS;

   // shipping: Array<Shipping> = OFFER_SHIPPING;
    shippingCountries: ShippingCountries[] = SHIPPINGCOUNTRIES;
    shippingCountriesRaffle: ShippingCountries[] = SHIPPINGCOUNTRIESRAFFLE;
    countriesForShipping: Array<Country>;

    @Input() shopSelected: Shop;

    displayedColumns: string[] = [
        'checkbox',
        'text',
        'url',
        'actions'
    ];

    timezones = TIMEZONES;

    links: Array<any> = [];

    subscriptions: Subscription[] = [];

    statusSelected = 'available';

    constructor(
        public formBuilder: FormBuilder,
        public shopsService: ShopsService,
        translateService: TranslateService) {
        super(translateService);
    }

    ngOnInit() {
        const sub = this.shopsService.getShopCountries().subscribe(response => {
            this.countriesForShipping = response.data;
        });
        if (!this.shopSelected) {
            this.shopSelected = {
                name: '',
                mainImage: ''
            };
        }

        this.subscriptions.push(sub);

        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        if (this.data.links) {
            this.links = this.data.links;
        } else {
            this.links = [];
        }

        this.createFormGroup();

        this.setupCtrlListeners();
    }

    ngAfterViewInit() {
        this.salePrice.setValue(this.calculateSalePrice());
        this.changeStatus(this.data.status);
        if (this.data.raffle) {
            this.delay(700).then(() => {
                document.getElementById('name').click();
              });
        }
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    ngOnDestroy() {
        super.onDestroy();
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    setupCtrlListeners() {
        this.onStatusChange();
        this.onPricesChange();
        this.onRaffleChange();
        // this.onSalePercentageChange();
        if (!this.releaseForm) {
            this.onReleaseChange();
        }
    }

    updateDisplayOnSales() {
        const salePrice = this.salePrice.value;
        const currStatus = this.statusCtrl.value;
        if (
            currStatus !== 'on_sale'
        ) {
            this.displayOnSaleCtrl.setValue(false, { emitEvent: false });
            this.displayOnSaleCtrl.disable({ emitEvent: false });
        } else {
            this.displayOnSaleCtrl.enable({ emitEvent: false });
        }
    }

    adjustPrices() {
        let price = this.shopSelected.currency ? this.formGroup.get('prices').get(`price${this.shopSelected.currency}`).value
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

    adjustPercent() {
        const value = this.salePercentage.value;
        if (value < 0) {
            this.salePercentage.setValue(0);
        }
        if (value > 100) {
            this.salePercentage.setValue(100);
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

    // TODO: get currency to shop else EUR
    calculateSalePrice() {
        let price = this.shopSelected.currency ? this.formGroup.get('prices').get(`price${this.shopSelected.currency}`).value
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
        let price = this.shopSelected.currency ? this.formGroup.get('prices').get(`price${this.shopSelected.currency}`).value
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

    onStatusChange() {
        const subStatusCtrl = this.statusCtrl
            .valueChanges
            .subscribe(status => {
                this.salePrice.setValue(this.calculateSalePrice());
                this.updateDisplayOnSales();
            });
        this.subscriptions.push(subStatusCtrl);
    }

    onPricesChange() {
        const subPricesCtrl = this.pricesCtrl.valueChanges.subscribe(() => {
            const price = this.calculateSalePrice();
            if (price !== this.salePrice.value) {
                this.salePrice.setValue(price);
            }
        });
        this.subscriptions.push(subPricesCtrl);
    }

    onRaffleChange() {
        const subRaffleCtrl = this.raffleCtrl
            .valueChanges
            .subscribe(isRaffle => {
                this.changeStatus(null);
                if (isRaffle) {
                    this.addRaffleTimeCtrls();
                    this.removeReleaseTimeCtrls();
                    this.changeShop(this.shopSelected);
                } else {
                    this.removeRaffleTimeCtrls();
                    this.addReleaseTimeCtrls();
                    this.changeShop(this.shopSelected);
                }
            });
        this.subscriptions.push(subRaffleCtrl);
    }

    onReleaseChange() {
        const subReleaseCtrl = this.formGroup.get('releaseId')
            .valueChanges
            .subscribe(releaseId => {
                if (!this.data.raffle) {
                    this.updateReleaseDateTime();
                }
                this.updatePricesBySelectedRelease(releaseId);
            });
        this.subscriptions.push(subReleaseCtrl);
    }


    onSalePriceChange() {
        const subSalePriceCtrl = this.salePrice
            .valueChanges
            .subscribe(() => {
                this.changeStatusToSalePrice();
            });
        this.subscriptions.push(subSalePriceCtrl);
    }

    changeStatusToSalePrice() {
        const statusControl = this.formGroup.get('status');
        if (!this.isRaffle) {
            if (this.salePrice.value && this.salePercentage.value) {
                statusControl.setValue('on_sale');
                statusControl.disable();
            } else {
                statusControl.setValue('available');
                statusControl.enable();
            }
        } else {
            statusControl.setValue(null);
            statusControl.enable();
        }
    }

    updatePricesBySelectedRelease(releaseId: string) {
        if (this.releases) {
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
                    priceEURCtrl.setValue(this.priceEUR(selectedRelease.priceEUR));
                }

                if (selectedRelease.priceUSD) {
                    priceUSDCtrl.setValue(this.priceUSD(selectedRelease.priceUSD));
                }

                if (selectedRelease.priceGBP) {
                    priceGBPCtrl.setValue(this.priceGBP(selectedRelease.priceGBP));
                }
            }
        }
    }

    priceEUR(priceEUR: number): number {
        if (this.shopSelected) {
            return (this.shopSelected.currency === 'EUR' || !this.shopSelected.currency) ? priceEUR : null;
        } else {
            return priceEUR;
        }
    }

    priceUSD(priceUSD: number): number {
        if (this.shopSelected) {
            return this.shopSelected.currency === 'USD' ? priceUSD : null;
        } else {
            return priceUSD;
        }
    }

    priceGBP(priceGBP: number): number {
        if (this.shopSelected) {
            return this.shopSelected.currency === 'GBP' ? priceGBP : null;
        } else {
            return priceGBP;
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
            startTime = `${('00' + hrs).slice(-2)}:${('00' + mins).slice(-2)}`;
        }

        if (this.data.raffleEnd) {
            endTime = '00:00';
            const endDate = new Date(this.data.raffleEnd);
            const hrs = endDate.getUTCHours();
            const mins = endDate.getUTCMinutes();
            endTime = `${('00' + hrs).slice(-2)}:${('00' + mins).slice(-2)}`;
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
            let exactTime = `${('00' + hrs).slice(-2)}:${('00' + mins).slice(-2)}`;
            this.formGroup.addControl('releaseTimeHours', new FormControl(exactTime));
        } else  {
            this.formGroup.addControl('releaseTime', new FormControl(null));
            this.formGroup.addControl('releaseTimeHours', new FormControl(null));
            this.updateReleaseDateTime();
        }
        const shopId = this.shopId;
        if (this.releaseDateTimeCtrl && !this.releaseDateTimeCtrl.value) {
            this.setTimezoneDefaultsFromShop(this.shops.find(shop => shop.id === shopId));
        }
    }

    removeReleaseTimeCtrls() {
        this.formGroup.removeControl('releaseTime');
        this.formGroup.removeControl('releaseTimeHours');
    }

    createFormGroup() {
        if (this.data.countries) {
            this.transformDataCountriesToArray();
        }
        this.salePercentage.setValue(this.data.salePercentage);
        const shipping = this.shopSelected ? this.shopSelected.shippingCountries : this.data.shipping;
        this.formGroup = new FormGroup({
            displayWhatsNew: new FormControl(this.data.displayWhatsNew),
            timezone: new FormControl(this.data.timezone),
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
            shopId: new FormControl(this.shopId ? this.shopId : this.data.shopId, [Validators.required]),

            // TODO: change shipping
            // shipping: new FormControl(shipping ? shipping : 'Not shipping selected'),
            shipping: new FormControl(this.data.shipping),
            countries: new FormControl(this.data.countries ? this.data.countries : null),
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

    transformDataCountriesToArray() {
        const countries: Array<string> = [];
        let index = 0;
        while (this.data.countries.split(',')[index]) {
            countries.push(this.data.countries.split(',')[index]);
            index ++;
        }
        this.data.countries = countries;
    }

    removeReleaseIdCtrl() {
        this.formGroup.removeControl('releaseId');
    }

    submitClicked() {
        if (this.formGroup.valid) {
            const entity = this.prepareEntity();

            entity.links = [];

            if (this.links) {
                this.links.forEach(element => {
                    delete element.id;
                    entity.links = [...entity.links, element];
                });
            }

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
        const entity: Offer = { id: this.data.id, ...offerTemp };
        entity.status = entity.status ? entity.status : 'on_sale';

        entity.priceEUR = this.pricesCtrl.get('priceEUR').value;
        entity.priceUSD = this.pricesCtrl.get('priceUSD').value;
        entity.priceGBP = this.pricesCtrl.get('priceGBP').value;

        entity.salePercentage = +this.salePercentage.value;

        // There's no datetimepicker, so in the UI the date and the time are set
        // separately. Here we are joining the values into 1 single field
        try {
            if (entity.countries) {
                entity.countries = entity.countries.join();
            }
        } catch { }
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

        if (entity.status !== 'on_sale') {
            entity.salePercentage = 0;
        }

        return entity;
    }

    changeShop(shop: Shop) {
        this.shopSelected = shop;
        this.updatePricesBySelectedRelease(this.releaseForm ? this.releaseId : this.formGroup.get('releaseId').value);
        const price = this.calculateSalePrice();
        if (price !== this.salePrice.value) {
            this.salePrice.setValue(price);
        }
        if (this.shopSelected.type === 'virtual') {
            if (typeof this.shopSelected.countries === 'string') {
                this.transformCountriesToArray();
            }
            this.formGroup.get('shipping').setValue(this.shopSelected.shippingCountries);
            this.formGroup.get('countries').setValue(this.shopSelected.countries);
        } else {
            this.removeShippingValues();
        }
    }

    removeShippingValues() {
        this.formGroup.get('shipping').setValue(null);
        this.formGroup.get('countries').setValue(null);
    }

    transformCountriesToArray() {
        const countries: Array<string> = [];
        let index = 0;
        while (this.shopSelected.countries.split(',')[index]) {
            countries.push(this.shopSelected.countries.split(',')[index]);
            index ++;
        }
        this.shopSelected.countries = countries;
    }

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

    get pricesCtrl() {
        return this.formGroup.get('prices') as FormGroup;
    }

    // get salePercentageCtrl() {
    //     return this.formGroup.get('salePercentage') as FormControl;
    // }

    get isRaffle() {
        return this.raffleCtrl.value as boolean;
    }

    get releaseDateCtrl() {
        return this.formGroup.get('releaseTime') as FormControl;
    }

    get releaseDateTimeCtrl() {
        return this.formGroup.get('releaseTimeHours') as FormControl;
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
        // if (state === 'coming_soon' && !this.data.raffle) {
        //     this.updateReleaseDateTime();
        // }
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
