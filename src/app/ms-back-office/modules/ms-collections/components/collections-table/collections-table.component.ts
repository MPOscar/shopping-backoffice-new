import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { Shop } from '../../../ms-shops/models/shops';
import { CollectionsService } from "../../services/collections.service";
import { Collection, CollectionsListResponse } from "../../models/collection";
import { Brand } from '../../../ms-brands/models/brand';

import { SeeCollectionComponent } from '../see-collection/see-collection.component';

const errorKey = 'Error';

@Component({
    selector: 'collections-table',
    templateUrl: './collections-table.component.html',
    styleUrls: ['./collections-table.component.scss']
})
export class CollectionsTableComponent implements OnDestroy, OnInit {

    displayedColumns: string[] = [
        'name',
        'thumbnail',
        'brand',
        'action'
    ];

    brands: Array<Brand>;

    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength: number = 0;

    collectionsList: Subscription;

    collections: Array<Collection> = [];

    modalRef: MatDialogRef<SeeCollectionComponent>;

    data: any;

    faceList: any;

    principal: any;

    shops: Array<Shop>;

    constructor(
        public dialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        public collectionsService: CollectionsService,
        public errorHandlingService: ErrorHandlingService
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        this.brands = this.activatedRoute.snapshot.data.brands;
        this.shops = this.activatedRoute.snapshot.data.shops;

        this.collectionsList = this.collectionsService.collectionsList.subscribe((brandsList: any) => {
            this.totalLength = brandsList.dataCount;
            this.collections = brandsList.data;
            if (this.collections.length === 0 && this.totalLength > 0 && this.collectionsService.previousPageSize > 0) {
                this.collectionsService.previousPageIndex =
                    Math.ceil(this.totalLength / this.collectionsService.previousPageSize) - 1;
                this.collectionsService.reloadCollections().subscribe(response => {
                    this.collectionsService.collectionsList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            }
        });
    }


    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.collectionsList.unsubscribe();
        this.filterValueChanges.unsubscribe();
    }

    createFilterFormGroup() {
        let group: any = {};
        group['name'] = new FormControl('');
        group['brand'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        this.collectionsService.getCollections(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: CollectionsListResponse) => {
                this.collectionsService.collectionsList.next(response);
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

    getBrand(id: string) {
        try {
            return this.brands.find(brand => {
                return brand.id === id;
            }).name;
        }
        catch (err) {
            return;
        }

    }

    seeCollectionModal(id: string) {

        this.collectionsService.getCollection(id).subscribe(response => {
            this.data = response.data;
            if (this.data.imgUrl) {
                let face: Face = {
                    imgUrl: this.data.imgUrl,
                };
                this.faceList = [face];
                this.principal = face;
            }

            this.modalRef = this.dialog.open(SeeCollectionComponent, {
                height: '750px',
                data: {
                    faceList: this.faceList,
                    principal: this.principal,
                    data: response.data,
                    brands: this.brands,
                    collectionId: id,
                    shops: this.shops,
                    collections: this.collections
                }
            });

        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        )
    }

}

