import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, Inject, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
//
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs';
//
import {ConfirmDialogComponent} from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import {ErrorHandlingService} from '../../../../../error-handling/services/error-handling.service';
import {HandledError} from '../../../../../error-handling/models/handled-error';
import {ToastrService} from '../../../../../error-handling/services/toastr.service';
//
import {Shop} from '../../../ms-shops/models/shops';
import {Offer, OffersListResponse} from '../../../ms-offers/models/offer';
import {Status, STATUS} from '../../../ms-offers/models/status';
import {OffersService} from '../../../ms-offers/services/offers.service';

import {Collection} from '../../../ms-collections/models/collection';
import {Release} from '../../../ms-releases/models/releases';
import {Brand} from '../../../ms-brands/models/brand';
import {BrandsService} from '../../../ms-brands/services/brands.service';

const timeZoneOffset = new Date().getTimezoneOffset();

const errorKey = 'Error';


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'menu-brands-new',
    templateUrl: './menu-brands-new.component.html',
    styleUrls: ['./menu-brands-new.component.scss']
})


export class MenuBrandsNewComponent implements AfterViewInit, OnInit, OnDestroy {

    @Input() brands: Array<Brand> = [];

    @Input() selectedBrands: Array<string> = [];

    displayedColumns: string[] = [
        'name',
        'mainImage',
        'description',
        'updatedAt',
        'actions'
    ];

    @Output() accept = new EventEmitter<any>();

    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength = 0;

    offersList: Subscription;

    status: Array<Status> = STATUS;

    @Input() releaseId: string;

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
        public brandsService: BrandsService,
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
        this.offersList = this.brandsService.brandsList.subscribe((brandsList: any) => {
            this.totalLength = brandsList.dataCount;
            this.brands = brandsList.data;
            if (this.brands.length === 0 && this.totalLength > 0 && this.brandsService.previousPageSize > 0) {
                this.brandsService.previousPageIndex =
                    Math.ceil(this.totalLength / this.brandsService.previousPageSize) - 1;
                this.brandsService.reloadBrands().subscribe(response => {
                        this.brandsService.brandsList.next(response);
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
        this.brandsService.getBrands(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: OffersListResponse) => {
                this.brandsService.brandsList.next(response);
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

    getBrandName(id: string) {
        try {
            return this.brands.find(brand => {
                return brand.id === id;
            }).name;
        } catch (err) {
            return;
        }

    }

    getBrandDescription(id: string) {
        try {
            return this.brands.find(brand => {
                return brand.id === id;
            }).description;
        } catch (err) {
            return;
        }

    }

    getBrandImage(id: string) {
        try {
            return this.brands.find(brand => {
                return brand.id === id;
            }).imgUrl;
        } catch (err) {
            return;
        }
    }

    selectedProduct(element: any) {
        this.product.name = this.getBrandName(element.id);
        this.product.id = element.id;
        this.product.description = this.getBrandDescription(element.id);
        this.accept.emit(this.product);
    }

    cancelClicked() {

    }

    close() {

    }

    isSelected(id) {
        return this.selectedBrands && this.selectedBrands.find(item => item === id) !== undefined;
    }
}

