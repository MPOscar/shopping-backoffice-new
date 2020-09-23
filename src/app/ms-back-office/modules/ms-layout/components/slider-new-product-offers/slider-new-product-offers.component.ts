import { Location } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
//
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Offer, OffersListResponse } from '../../../ms-offers/models/offer';
import { Status, STATUS } from '../../../ms-offers/models/status';
import { OffersService } from '../../../ms-offers/services/offers.service';
import { Release } from '../../../ms-releases/models/releases';
//
import { Shop } from '../../../ms-shops/models/shops';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';

const timeZoneOffset = new Date().getTimezoneOffset();

const errorKey = 'Error';


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'slider-new-product-offers',
    templateUrl: './slider-new-product-offers.component.html',
    styleUrls: ['./slider-new-product-offers.component.scss']
})


export class SlidersNewProductOffersComponent implements AfterViewInit, OnInit, OnDestroy {

    offers: Array<Offer> = [];

    @Input() releases: Array<Release> = [];

    @Input() shops: Array<Shop>;

    @Input() releaseId: string;

    @Output() accept = new EventEmitter<any>();

    displayedColumns: string[] = [
        'shopId',
        'name',
        'mainImage',
        'description',
        'updatedAt',
        'actions'
    ];


    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength = 0;

    offersList: Subscription;

    status: Array<Status> = STATUS;


    timeZoneOffset = 60;

    data: any;

    product = {
        id: '',
        name: '',
        description: ''
    };

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public offersService: OffersService,
        public errorHandlingService: ErrorHandlingService,
        public location: Location,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        this.offersList = this.offersService.offersList.subscribe((offersList: any) => {
            this.totalLength = offersList.dataCount;
            this.offers = offersList.data;
            if (this.offers.length === 0 && this.totalLength > 0 && this.offersService.previousPageSize > 0) {
                this.offersService.previousPageIndex =
                    Math.ceil(this.totalLength / this.offersService.previousPageSize) - 1;
                this.offersService.reloadOffers().subscribe(response => {
                    this.offersService.offersList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            }
        });
    }

    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.offersList.unsubscribe();
        this.filterValueChanges.unsubscribe();
    }

    createFilterFormGroup() {
        const group: any = {};
        group['name'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        this.offersService.getOffers(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: OffersListResponse) => {
                this.offersService.offersList.next(response);
            },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err);
                });
    }

    onFilter() {
        this.paginator.pageIndex = 0;
        this.loadPage();
    }

    onSort() {
        this.paginator.pageIndex = 0;
        this.loadPage();
    }

    onPage() {
        this.loadPage();
    }

    getReleaseName(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).name;
        } catch (err) {
            return;
        }

    }

    getReleaseDescription(id: string, tooltip: boolean = false) {
        try {
            const description = this.releases.find(release => {
                return release.id === id;
            }).description;
            if (tooltip && description.length <= 150) {
                return '';
            }
            return description;
        } catch (err) {
            return;
        }

    }

    getReleaseImage(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).mainImage;
        } catch (err) {
            return;
        }
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

    selectedProduct(element: any) {
        this.product.name = this.getReleaseName(element.releaseId);
        this.product.id = element.id;
        this.product.description = this.getReleaseDescription(element.releaseId);
        this.accept.emit(this.product);
    }

    cancelClicked() {

    }

    close() {

    }

}

