import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ErrorHandlingService } from '../../../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../../../error-handling/models/handled-error';
//
import { UrlsService } from '../../services/urls.service';
import { Link, UrlsListResponse } from '../../models/urls';
import { EditLinkComponent } from '../edit-link/edit-link.component';
import { NewLinkComponent } from '../new-link/new-link.component';
import { Shop } from 'src/app/ms-back-office/modules/ms-shops/models/shops';

const errorKey = 'Error';

@Component({
    selector: 'links-table',
    templateUrl: './links-table.component.html',
    styleUrls: ['./links-table.component.scss']
})
export class LinksTableComponent implements OnInit {

    @Output() linksEventEmiter: EventEmitter<any> = new EventEmitter();

    displayedColumns: string[] = [
        'url',
        'text',
        'action'
    ];

    @Input() links: any = [];

    @Input() shop: Shop;

    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength = 0;
    index = 0;

    urlsList: Subscription;

    urls: Array<Link> = [];

    modalRef: MatDialogRef<NewLinkComponent | EditLinkComponent>;

    constructor(
        public dialog: MatDialog,
        public urlsService: UrlsService,
        public errorHandlingService: ErrorHandlingService
    ) {
    }

    ngOnInit() {

        this.links.forEach(element => {
            element.id = ++this.index;
        });

        // Begin observing style list changes.
        this.urlsList = this.urlsService.urlsList.subscribe((urlsList: any) => {
            this.totalLength = urlsList.dataCount;
            this.urls = urlsList.data;
            if (this.urls.length === 0 && this.totalLength > 0 && this.urlsService.previousPageSize > 0) {
                this.urlsService.previousPageIndex =
                    Math.ceil(this.totalLength / this.urlsService.previousPageSize) - 1;
                this.urlsService.reloadUrls().subscribe(response => {
                    this.urlsService.urlsList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            }
        });
    }

    createFilterFormGroup() {

    }

    loadPage() {

    }

    onFilter() {
        this.paginator.pageIndex = 0;
    }

    onSort() {
        this.paginator.pageIndex = 0;
    }

    onPage() {
    }

    addUrlModalBrand() {
        this.modalRef = this.dialog.open(NewLinkComponent, {
            data: {
                dialogData: this.urls,
                shop: this.shop
            }
        });

        this.modalRef.afterClosed().subscribe((response) => {
            if (response) {
                response.id = ++this.index;
                this.links = [...this.links, response];
                this.linksEventEmiter.emit(this.trackedLinks());
            }
        });
    }

    editUrlModalBrand(id: string) {
        this.modalRef = this.dialog.open(EditLinkComponent, {
            data: {
                data: this.links.find(item => {
                    return item.id === id;
                }),
                shop: this.shop
            }
        });

        this.modalRef.afterClosed().subscribe((response) => {
            if (response) {
                this.links.forEach(element => {
                    if (response.id === element.id) {
                        element = response;
                    }
                });
                this.linksEventEmiter.emit(this.trackedLinks());
            }


        });
    }

    deleteLinks(id: any) {
        let links = [];
        this.links.forEach(element => {
            if (element.id !== id) {
                links = [...links, element];
            }
        });
        this.links = links;
        this.linksEventEmiter.emit(this.trackedLinks());

    }

    trackedLinks() {
        return this.links.map(link => {
            link.trackedUrl = this.shop.trackingListBaseUrl + encodeURI(link.url);
            return link;
        });
    }


}

