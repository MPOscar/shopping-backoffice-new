import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { UrlsService } from "../../services/urls.service";
import { Link } from "../../models/urls";
import { EditLinkComponent } from '../edit-link/edit-link.component';
import { NewLinkComponent } from '../new-link/new-link.component';
import { Shop } from '../../../ms-shops/models/shops';

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

    totalLength: number = 0;

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

        let index = 0;
        this.links.forEach(element => {
            element.id = index;
            index++;
        });
        //this.filter = this.createFilterFormGroup();
        //this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        //this.paginator.pageIndex = 0;

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
        /*let group: any = {};
        group['url'] = new FormControl('');
        return new FormGroup(group);*/
    }

    loadPage() {
        /*this.urlsService.getUrls(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: UrlsListResponse) => {
                this.urlsService.urlsList.next(response);
            },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err)
                });
                */
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

    addUrlModalBrand() {
        this.modalRef = this.dialog.open(NewLinkComponent, {
            //height: '50%',
            //width: '50%',
            data: { dialogData: this.urls,
                    shop: this.shop
                }
        });

        this.modalRef.afterClosed().subscribe((responce) => {
            if (responce) {
                this.links = [...this.links, responce];
                this.linksEventEmiter.emit(this.links);
            }
        });
    }

    editLinkModal(id: string) {
        this.modalRef = this.dialog.open(EditLinkComponent, {
            data: {
                data: this.links.find(item => {
                    return item.id === id;
                }),
                shop: this.shop
            }
        });

        this.modalRef.afterClosed().subscribe((responce) => {
            if (responce) {
                this.links.forEach(element => {
                    if (responce.id === element.id) {
                        element = responce;
                    }
                });
                this.linksEventEmiter.emit(this.links);
            }


        });
    }

    deleteLinks(id: any) {
        let links = [];
        this.links.forEach(element => {
            if (element.id !== id)
                links = [...links, element];
        });
        this.links = links;
        this.linksEventEmiter.emit(this.links);

    }


}

