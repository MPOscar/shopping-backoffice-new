import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
//
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ConfigService } from '../../../../../config/services/config.service';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { ShopsService } from "../../services/shops.service";
import { Shop, ShopsListResponse } from "../../models/shops";
import { STATUS, Status } from '../../models/status';

const errorKey = 'Error';

const timeZoneOffset = new Date().getTimezoneOffset();

@Component({
    selector: 'shops-table',
    templateUrl: './shops-table.component.html',
    styleUrls: ['./shops-table.component.scss']
})
export class ShopsTableComponent implements OnInit {

    displayedColumns: string[] = [
        'name',
        'thumbnail',
        'active',
        'country',
        'currency',
        'updatedAt',
        'rank',
        //'shipingDetails',
        'action'
    ];

    filter: FormGroup;

    filterValueChanges: Subscription;

    status: Status[] = STATUS;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength: number = 0;

    shopsList: Subscription;

    shops: Array<Shop> = [];

    timeZoneOffset = 60;

    constructor(
        public configService: ConfigService,
        public shopsService: ShopsService,
        public errorHandlingService: ErrorHandlingService
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        this.shopsList = this.shopsService.shopsList.subscribe((shopsList: any) => {
            this.totalLength = shopsList.dataCount;
            this.shops = shopsList.data;
            if (this.shops.length === 0 && this.totalLength > 0 && this.shopsService.previousPageSize > 0) {
                this.shopsService.previousPageIndex =
                    Math.ceil(this.totalLength / this.shopsService.previousPageSize) - 1;
                this.shopsService.reloadShops().subscribe(response => {
                    this.shopsService.shopsList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            }
        });
    }


    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.shopsList.unsubscribe();
        this.filterValueChanges.unsubscribe();
    }

    createFilterFormGroup() {
        let group: any = {};
        group['name'] = new FormControl('');
        group['status'] = new FormControl('');
        group['country'] = new FormControl('');
        group['isParent'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        this.shopsService.getShops(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: ShopsListResponse) => {
                this.shopsService.shopsList.next(response);
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

    changeStatus(shopData: Shop) {
        //shopData.createdAt = null;
        //shopData.updatedAt = null;
        shopData.active = !shopData.active;
        this.shopsService.putShop(shopData).subscribe(response => {
            this.loadPage();
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });
    }

    getImage(item: Shop) {
        return item.smallImage ? item.smallImage : item.mainImage ? item.mainImage : 'assets/images/no-image.svg';
    }

}

