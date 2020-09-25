import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { Shop } from '../../../ms-shops/models/shops';
import { BrandsService } from "../../services/brands.service";
import { Brand, BrandsListResponse } from "../../models/brand";
import { Collection } from '../../../ms-collections/models/collection';
import { StylesService } from '../../../ms-style/services/styles.service';
import { SeeBrandComponent } from '../see-brand/see-brand.component';

const errorKey = 'Error';

const timeZoneOffset = new Date().getTimezoneOffset();

@Component({
    selector: 'brands-table',
    templateUrl: './brands-table.component.html',
    styleUrls: ['./brands-table.component.scss']
})
export class BrandsTableComponent implements AfterViewInit, OnInit {

    displayedColumns: string[] = [
        'name',
        'thumbnail',
        'collection',
        'popular models',
        'createdAt',
        'actions'
    ];

    collections: Array<Collection>;

    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength: number = 0;

    brandsList: Subscription;

    brands: Array<Brand> = [];

    timeZoneOffset = 60;

    data: any;

    modalRef: MatDialogRef<SeeBrandComponent>;

    faceList: any;

    principal: any;

    shops: Array<Shop>;

    constructor(
        public dialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        public brandsService: BrandsService,
        public errorHandlingService: ErrorHandlingService,
        public stylesService: StylesService,
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        this.collections = this.activatedRoute.snapshot.data.collections;
        this.shops = this.activatedRoute.snapshot.data.shops;

        // Begin observing style list changes.
        this.brandsList = this.brandsService.brandsList.subscribe((brandsList: any) => {
            this.totalLength = brandsList.dataCount;
            this.brands = brandsList.data;
            this.brands.forEach(brand => {
               this.stylesService.getPopularStyle(brand.id).subscribe(response => {
                    let styles: string = "";
                    response.data.forEach(style => {
                        styles += style.name + "<br>";
                    });
                    brand.popularStyle =  styles;
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
                )
            });
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
        this.brandsList.unsubscribe();
        this.filterValueChanges.unsubscribe();
    }

    createFilterFormGroup() {
        let group: any = {};
        group['name'] = new FormControl('');
        //group['collection'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        this.brandsService.getBrands(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: BrandsListResponse) => {
                this.brandsService.brandsList.next(response);
            },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err)
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

    popularStyles(brandId: string) {

    }

    getCollections(brandId: string) {

        let collections: any;
        collections = this.collections.filter(collection => {
            return collection.brand === brandId;
        });

        let collectionList: string = "";
        collections.forEach(collection => {
            collectionList += collection.name + "<br>";
        });

        return collectionList;

    }

    seeBrandModal(id: string) {

        this.brandsService.getBrand(id).subscribe(response => {
            this.data = response.data;

            if (this.data.imgUrl) {
                let face: Face = {
                    imgUrl: this.data.imgUrl,
                };
                this.faceList = [face];
                this.principal = face;
            }

            this.modalRef = this.dialog.open(SeeBrandComponent, {
                height: '650px',
                width: '535px',
                data: {
                    id: id,
                    faceList: this.faceList,
                    principal: this.principal,
                    data: response.data,
                    shops: this.shops,
                }
            });
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        )
    }
}

