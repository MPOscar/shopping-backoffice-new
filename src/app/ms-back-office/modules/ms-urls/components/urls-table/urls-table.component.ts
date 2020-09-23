import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
import { UrlsService } from "../../services/urls.service";
import { Url, UrlsListResponse } from "../../models/urls";
import { EditUrlComponent } from '../edit-url/edit-url.component';
import { NewUrlComponent } from '../new-url/new-url.component';

const errorKey = 'Error';

@Component({
    selector: 'urls-table',
    templateUrl: './urls-table.component.html',
    styleUrls: ['./urls-table.component.scss']
})
export class UrlsTableComponent implements OnInit {

    displayedColumns: string[] = [
        'URL',
        'VANITY URL',
        'ACTIONS'
    ];

    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength: number = 0;

    urlsList: Subscription;

    urls: Array<Url> = [];

    modalRef: MatDialogRef<NewUrlComponent | EditUrlComponent>;

    constructor(
        public dialog: MatDialog,
        public urlsService: UrlsService,
        public errorHandlingService: ErrorHandlingService
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

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


    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.urlsList.unsubscribe();
        this.filterValueChanges.unsubscribe();
    }

    createFilterFormGroup() {
        let group: any = {};
        group['url'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        this.urlsService.getUrls(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: UrlsListResponse) => {
                this.urlsService.urlsList.next(response);
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

    addUrlModalBrand() {
        this.modalRef = this.dialog.open(NewUrlComponent, {
            data: { dialogData: this.urls }
        });

        this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
    }

    editUrlModalBrand(id: string) {
        this.modalRef = this.dialog.open(EditUrlComponent, {
            data: { id: id }
        });

        this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
    }

}

