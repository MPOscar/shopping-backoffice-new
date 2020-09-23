import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Deal } from '../../../ms-deals/models/deal';
import { Offer } from '../../../ms-offers/models/offer';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';
//
import { StylesService } from '../../../ms-style/services/styles.service';
import { LayoutService } from "../../services/layout.service";
import { LayoutSlider, UrlsListResponse } from "../../models/layout";
import { Filter, FilterItem } from '../../models/filters';



const errorKey = 'Error';

@Component({
    selector: 'layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    filters: Array<FilterItem>;

    brands: Array<Brand>;

    categories: Array<Category>;

    collections: Array<Collection>;

    deals: Array<Deal>;

    displayedColumns: string[] = [
        'URL',
        'VANITY URL',
        'ACTIONS'
    ];

    releases: Array<Release>;

    shops: Array<Shop>;

    styles: Array<Style>;

    offers: Array<Offer>;

    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength: number = 0;

    urlsList: Subscription;

    urls: Array<LayoutSlider> = [];

    pageId: string = 'home';

    flag: boolean = true;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public urlsService: LayoutService,
        public errorHandlingService: ErrorHandlingService,
        public layoutService: LayoutService,
        public stylesService: StylesService,
    ) {
    }

    ngOnInit() {
        this.brands = this.activatedRoute.snapshot.data.brands;
        this.categories = this.activatedRoute.snapshot.data.categories;
        this.collections = this.activatedRoute.snapshot.data.collections;
        this.deals = this.activatedRoute.snapshot.data.deals;
        this.offers = this.activatedRoute.snapshot.data.offers;
        this.releases = this.activatedRoute.snapshot.data.releases;
        this.shops = this.activatedRoute.snapshot.data.shops;
        this.styles = this.activatedRoute.snapshot.data.styles;
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
    }

    layoutEvent(layout: string) {
        this.pageId = layout;
        this.flag = false;
        this.stylesService.getAllStyles().subscribe(response => {
            this.flag = true;
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        )
    }

}

