import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
//
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Shop, WeekHours } from '../../models/shops';
import { Brand } from '../../../ms-brands/models/brand';
import { Currency, CURRENCY } from '../../models/currency';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Country } from '../../models/country';
import { Rank, RANK } from '../../models/rank';
import { Region, REGIONS, SHOWONREGIONS } from '../../models/regions';
import { ShippingCountries, SHIPPINGCOUNTRIES } from '../../models/shippingCountries';
import { ShopsService } from '../../services/shops.service';
import { OpenStreetMapService } from '../../services/open-sreet-map.service';

import { ShopsSellingStyleModalComponent } from '../shops-selling-style-modal/shops-selling-style-modal.component';
import { ShopsImgesService } from '../../services/shops-images.service';
import { ErrorHandlingService } from 'src/app/error-handling/services/error-handling.service';
import { HandledError } from 'src/app/error-handling/models/handled-error';

declare var ol: any;

const errorKey = 'Error';

const MAP_MARKER = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/200px-Map_marker_font_awesome.svg.png';

@Component({
    selector: 'shop-form',
    templateUrl: './shop-form.component.html',
    styleUrls: ['./shop-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ShopFormComponent extends BaseReactiveFormComponent<Shop> implements OnInit, OnDestroy, AfterViewInit {

    formType: string;

    @Input() brands: Array<Brand>;

    @Input() categories: Array<Category>;

    @Input() collections: Array<Collection>;

    @Input() faceList: Array<Face> = [];

    @Input() shops: Array<Shop>;

    @Input() countries: Array<Country>;

    lat = 45.763420;

    lon = 4.834277;

    parentShops: Array<Shop>;

    currency: Currency[] = CURRENCY;

    countriesForShipping: Array<Country> = [];

    countriesStatic: Array<Country>;

    shippingCountries: ShippingCountries[] = SHIPPINGCOUNTRIES;

    regions: Region[] = REGIONS;

    rank: Rank[] = RANK;

    mainImage: Face;

    smallImage: Face;

    headerImage: Face;

    faces: FormControl;

    workingHours: FormArray;

    workingHoursForm: FormGroup;

    modalRef: MatDialogRef<ShopsSellingStyleModalComponent>;

    shop: Shop;

    showOnRegions: Region[] = SHOWONREGIONS;

    myControl = new FormControl('');

    options: any[] = [];

    filteredOptions: Observable<any[]>;

    optionsSeach: any;

    ifIHaveToSearchPredictions = true;

    vectorSource: any;

    lastSearch: any;

    map: any;

    subscriptions: Subscription[] = [];

    @ViewChild('map') mapContainer: ElementRef;

    daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    shopTypes: string[] = ['physical', 'virtual'];
    typeSelected: string;

    currentParent: string;

    constructor(
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        public openStreetMapService: OpenStreetMapService,
        public shopsService: ShopsService,
        translateService: TranslateService,
        private errorHandlingService: ErrorHandlingService,
        private renderer: Renderer2,
        public shopsImgesService: ShopsImgesService) {
        super(translateService);
        // setTranslations(this.translateService, TRANSLATIONS);TODO
    }

    ngOnInit() {
        this.createMap();
        this.getCurrentLocation();
        if (this.data.name) {
            this.formType = 'edit';
            this.getAddressToData();
            this.mainImage = {
                imgUrl: this.data.mainImage ? this.data.mainImage : '',
                state: State.Edited,
                mainImage: true
            };
            this.smallImage = {
                imgUrl: this.data.smallImage ? this.data.smallImage : this.mainImage.imgUrl,
                state: State.Edited,
                smallImage: true,
            };
            this.headerImage = {
                imgUrl: this.data.headerImage ? this.data.headerImage : this.mainImage.imgUrl,
                state: State.Edited,
                headerImage: true,
            };
            this.data.faces = [];
            this.data.faces.push(this.mainImage, this.smallImage, this.headerImage);
        } else {
            this.formType = 'create';
            this.data.type = 'physical';
            this.typeSelected = 'physical';
        }

        this.parentShops = this.shops.filter(shop => shop.isParent);

        const sub = this.shopsService.getShopCountries().subscribe(response => {
            this.countriesStatic = response.data;
            this.countriesForShipping = response.data;
            this.countries = this.countriesStatic.filter(item => {
                return item.country === this.data.country;
            });
        });

        this.subscriptions.push(sub);

        this.validationGetErrors();

        this.createFormGroup();

        this.setupParentCtrlListener();

        this.subscribeAddressControl();

        this.typeSelected = this.data.type;
    }

    getAddressToData() {
        if (this.data.address) {
            const sub = this.openStreetMapService
                .getAddressPredictions(this.data.address)
                .subscribe(response => {
                    this.optionsSeach = [];
                    this.lastSearch = response;
                    response.forEach(val => {
                        this.optionsSeach = [...this.optionsSeach, val.display_name];
                    });

                    const value = this.formGroup.get('address').value;
                    this.formGroup.get('address').setValue(value);

                    const address = this.lastSearch.find(itemAddress => {
                        return itemAddress.display_name === this.data.address;
                    });

                    if (address) {
                        this.setMarkerByLonLat(parseFloat(address.lon), parseFloat(address.lat));
                    }
                });
            this.subscriptions.push(sub);
        }
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (this.formType === 'edit') {
            this.map = new ol.Map({
                target: 'map',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([73.8567, 18.5204]),
                    zoom: 18
                })
            });
        }
        this.delay(700).then(() => {
            document.getElementById('name').click();
          });
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    validationGetErrors() {
        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;
    }

    subscribeAddressControl() {
        const sub1 = this.formGroup.get('address')
            .valueChanges
            .subscribe(response => {
                if (this.ifIHaveToSearchPredictions) {
                    const delay_observable = of('').pipe(delay(200));
                    const sub2 = delay_observable.subscribe(delay => {
                        this.ifIHaveToSearchPredictions = false;
                        const sub3 = this.openStreetMapService
                            .getAddressPredictions(response)
                            .subscribe(response => {
                                this.optionsSeach = [];
                                this.lastSearch = response;
                                response.forEach(val => {
                                    this.optionsSeach = [...this.optionsSeach, val.display_name];
                                });
                                const value = this.formGroup.get('address').value;
                                this.formGroup.get('address').setValue(value);
                                this.ifIHaveToSearchPredictions = true;
                            });
                        this.subscriptions.push(sub3);
                    });
                    this.subscriptions.push(sub2);
                }
            });

        this.subscriptions.push(sub1);

        this.filteredOptions = this.formGroup.get('address').valueChanges.pipe(
            startWith(''),
            map(display_name => display_name
                ? this._filter(display_name)
                : this.options.slice()
            )
        );
    }

    ngOnDestroy() {
        super.onDestroy();
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    createMap() {
        const marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([this.lon, this.lat])),
            name: 'Marker'
        });

        marker.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                scale: 0.1,
                src: MAP_MARKER,
            })
        }));


        this.vectorSource = new ol.source.Vector({
            features: [marker]
        });

        const VectorLayer = new ol.layer.Vector({
            source: this.vectorSource,
        });

        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                }),
                VectorLayer
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([this.lon, this.lat]),
                zoom: 18
            })
        });
    }

    displayFn(val?: string): string | undefined {
        return val ? val : undefined;
    }

    private _filter(val: any) {
        if (this.optionsSeach) {
            if (this.optionsSeach.length > 0) {
                this.options = this.optionsSeach;
            }
        }

        return this.options.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    createFormGroup() {
        this.currentParent = this.data.parent;
        this.formGroup = new FormGroup({
            faceMain: new FormControl(),
            faceSmall: new FormControl(),
            faceHeader: new FormControl(),
            name: new FormControl(this.data.name, [Validators.required]),
            type: new FormControl(this.data.type ? this.data.type : 'physical'),
            address: new FormControl(this.data.address),
            shippingDetails: new FormControl(this.data.shippingDetails),
            shippingCountries: new FormControl(this.data.shippingCountries),
            countries: new FormControl(this.data.countries),
            description: new FormControl(this.data.description),
            makeDeal: new FormControl(this.data.makeDeal),
            brands: new FormControl(this.data.brands, [Validators.required]),
            currency: new FormControl(this.data.currency),
            rank: new FormControl(this.data.rank),
            region: new FormControl(this.data.region),
            country: new FormControl(this.data.country),
            defaultOfferLabel: new FormControl(this.data.defaultOfferLabel),
            active: new FormControl(true),
            categories: new FormControl(this.data.categories, [Validators.required]),
            trackingListBaseUrl: new FormControl(this.data.trackingListBaseUrl,
                [Validators.pattern('(http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?')]),
            zipCode: new FormControl(this.data.zipCode),
            isParent: new FormControl(this.data.isParent),
            parent: new FormControl(this.data.parent),
            showOnRegion: new FormControl(this.data.showOnRegion),
            workingHours: this.formBuilder.array(this.daysOfWeek.map(dayOfWeek => {
                return this.formBuilder.group(this.createDayFormControl(dayOfWeek));
            })),
        });
    }

    getDayOfWeekIndex(dayOfWeek: string): number {
        return this.daysOfWeek.findIndex(day => day === dayOfWeek) + 1;
    }

    createDayFormControl(dayOfWeek: string) {
        const dayOfWeekIndex: number = this.getDayOfWeekIndex(dayOfWeek);
        const weekHour: WeekHours = this.findWorkingHoursInData(dayOfWeekIndex);
        const day = {};
        day['dayOfWeek' + dayOfWeek] = dayOfWeekIndex;
        day['openHour' + dayOfWeek] = new FormControl(weekHour.openHour ? weekHour.openHour : '00:00');
        day['closeHour' + dayOfWeek] = new FormControl(weekHour.closeHour ? weekHour.closeHour : '00:00');
        day['offWork' + dayOfWeek] = new FormControl(weekHour.offWork);
        return day;
    }

    findWorkingHoursInData(day: number): WeekHours {
        const weekHours: WeekHours = {
            dayOfWeek: day,
            openHour: '00:00',
            closeHour: '00:00',
            offWork: true
        };
        if (this.data.workingHours && this.data.workingHours.length) {
            const finded: WeekHours = this.data.workingHours.find((val) => val.dayOfWeek === day);
            if (finded) {
                if (finded.openHour) {
                    weekHours.openHour = finded.openHour;
                }
                if (finded.closeHour) {
                    weekHours.closeHour = finded.closeHour;
                }
                weekHours.offWork = finded.offWork;
            }
        }
        return weekHours;
    }

    buidlWorkingHours(workingHours: Array<any>) {
        return this.daysOfWeek.map(dayOfWeek => {
            return this.getWorkingHourDay(dayOfWeek, workingHours);
        });
    }

    getWorkingHourDay(dayOfWeek: string, workingHours: Array<any>): WeekHours {
        const dayOfWeekIndex = this.getDayOfWeekIndex(dayOfWeek);
        const weekDay: WeekHours = {
            dayOfWeek: dayOfWeekIndex,
            openHour: '00:00',
            closeHour: '00:00',
            offWork: true
        };
        if (workingHours.length > dayOfWeekIndex) {
            weekDay.dayOfWeek = workingHours[dayOfWeekIndex - 1]['dayOfWeek' + dayOfWeek];
            weekDay.openHour = workingHours[dayOfWeekIndex - 1]['openHour' + dayOfWeek];
            weekDay.closeHour = workingHours[dayOfWeekIndex - 1]['closeHour' + dayOfWeek];
            weekDay.offWork = workingHours[dayOfWeekIndex - 1]['offWork' + dayOfWeek];
        }
        return weekDay;
    }

    changeWorkHourStatus(dayOfWeek: string) {
        // let openHour = "openHour" + day;
        // this.formGroup.get(`workingHours.${index}.openHourMonday`).setValue('01:00');
        const dayOfWeekIndex = this.getDayOfWeekIndex(dayOfWeek);
        const formControls = this.formGroup.controls['workingHours']['controls'][dayOfWeekIndex - 1].controls;
        const offWork = formControls['offWork' + dayOfWeek];
        if (!offWork.value) {
            formControls['openHour' + dayOfWeek].setValue('00:00');
            formControls['closeHour' + dayOfWeek].setValue('00:00');
            // formControls['openHour' + dayOfWeek].disable();
            // formControls['closeHour' + dayOfWeek].disable();
        } else {
            // formControls['openHour' + dayOfWeek].enable();
            // formControls['closeHour' + dayOfWeek].enable();
        }
    }

    setupParentCtrlListener() {
        const parentShopCtrl = this.formGroup.get('parent') as FormControl;
        const sub = parentShopCtrl
            .valueChanges
            .subscribe(selectedParentShopId => {
                if (selectedParentShopId !== this.currentParent) {
                    this.currentParent = selectedParentShopId;
                    const brandCtrl = this.formGroup.get('brands');
                    const categoryCtrl = this.formGroup.get('categories');
                    const showOnRegionCtrl = this.formGroup.get('showOnRegion');
                    const facesCtrl = this.formGroup.get('faceMain');
                    if (selectedParentShopId) {
                        const selectedParentShop = this.shops
                            .find(shop => shop.id === selectedParentShopId);

                        this.mainImage = {
                            imgUrl: selectedParentShop.mainImage
                        };

                        facesCtrl.setValue([this.mainImage]);

                        brandCtrl.setValue(selectedParentShop.brands);
                        categoryCtrl.setValue(selectedParentShop.categories);
                        // REVIEW: Currently Regions ID are the same as names
                        // so the names are unique. if this changes and names
                        // stop being unique this code will might not work as intended
                        const region = SHOWONREGIONS.find(reg => reg.name === selectedParentShop.showOnRegion);
                        showOnRegionCtrl.setValue(region ? region.id : '');
                    } else {
                        this.mainImage = null;
                        facesCtrl.setValue(null);
                        brandCtrl.setValue(null);
                        categoryCtrl.setValue(null);
                        showOnRegionCtrl.setValue(null);
                    }
                }
            });
        this.subscriptions.push(sub);
    }

    setMarkerByAddress(address: string) {
        this.vectorSource.clear();
        const addressItem = this.lastSearch.find(item => {
            return item.display_name === address;
        });
        const lon: number = parseFloat(addressItem.lon);
        const lat: number = parseFloat(addressItem.lat);
        this.setMarkerByLonLat(lon, lat);

        this.data.lat = lat;
        this.data.lon = lon;
    }

    setMarkerByLonLat(lon: number, lat: number) {
        let marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
            name: 'Marker'
        });

        // specific style for that one point
        marker.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                scale: 0.1,
                src: MAP_MARKER,
            })
        }));

        this.vectorSource = new ol.source.Vector({
            features: [marker]
        });

        const VectorLayer = new ol.layer.Vector({
            source: this.vectorSource,
        });


        this.map.getView().setCenter(ol.proj.fromLonLat([lon, lat]));

        this.map.addLayer(VectorLayer);

    }

    setMapContainer() {
        this.renderer[this.data.isParent ? 'addClass' : 'removeClass'](this.mapContainer.nativeElement, 'display-none');
    }

    toggleIsParent() {
        this.data.isParent = this.data.isParent ? false : true;
        this.setMapContainer();
    }

    submitClicked() {
        if (this.formGroup.valid) {
            try {
                this.data.countries = this.data.countries.join();
            } catch { }

            this.data.workingHours = this.buidlWorkingHours(this.data.workingHours);

            if (this.data.isParent) {
                this.data.parent = null;
            }

            const faceMain: Face = this.formGroup.get('faceMain').value;
            const faceSmall: Face = this.formGroup.get('faceSmall').value;
            const faceHeader: Face = this.formGroup.get('faceHeader').value;
            this.data.faces = [];
            if (faceMain) {
                faceMain.mainImage = true;
                this.data.faces.push(faceMain);
            }
            if (faceSmall) {
                faceSmall.smallImage = true;
                this.data.faces.push(faceSmall);
            }
            if (faceHeader) {
                faceHeader.headerImage = true;
                this.data.faces.push(faceHeader);
            }
            this.accept.emit(this.data);

        } else {
            this.triggerValidation();
        }
    }

    showModal() {
        this.modalRef = this.dialog.open(ShopsSellingStyleModalComponent, {
            height: '800px',
            width: '60%',
            data: {
                face: this.shop,
                shops: this.shops,
            }
        });
    }

    selectCountry(region: string) {
        this.countries = this.countriesStatic.filter(country => {
            return country.region === region;
        });
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lon = position.coords.longitude;
                this.setMarkerByLonLat(this.lon, this.lat);
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }


    selectType(type: string) {
        this.typeSelected = type;
    }

    cancelClicked() {
        this.cancel.emit();
    }
}

