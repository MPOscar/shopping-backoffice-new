import { AfterViewInit, Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { DealsService } from '../../services/deals.service';
import { Deal, DealsListResponse } from '../../models/deal';
import { Collection } from '../../../ms-collections/models/collection';
import { NewDealComponent } from '../new-deal/new-deal.component';
import { EditDealComponent } from '../edit-deal/edit-deal.component';
import { Url } from '../../../ms-urls/models/urls';
import { Shop } from '../../../ms-shops/models/shops';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Deal?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
    selector: 'deals-table',
    templateUrl: './deals-table.component.html',
    styleUrls: ['./deals-table.component.scss']
})
export class DealsTableComponent implements AfterViewInit, OnInit, OnDestroy {

    displayedColumns: string[] = [
        'URL',
        'THUMBNAIL',
        'SALEPERCENTAGE',
        'STATUS',
        'PROMOCODE',
        'TIME',
        'ACTIONS'
    ];

    collections: Array<Collection>;

    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength = 0;

    dealsList: Subscription;

    deals: Array<Deal> = [];

    modalRef: MatDialogRef<NewDealComponent | EditDealComponent | ConfirmDialogComponent>;

    urls: Array<Url>;

    shops: Array<Shop>;

    @Input() shopId: string;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dealsService: DealsService,
        public dialog: MatDialog,
        public errorHandlingService: ErrorHandlingService,
        public location: Location,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        this.collections = this.activatedRoute.snapshot.data.collections;
        this.urls = this.activatedRoute.snapshot.data.urls;
        this.shops = this.activatedRoute.snapshot.data.shops;

        // Begin observing style list changes.
        this.dealsList = this.dealsService.dealsList.subscribe((dealsList: any) => {
            this.totalLength = dealsList.dataCount;
            this.deals = dealsList.data;
            if (this.deals.length === 0 && this.totalLength > 0 && this.dealsService.previousPageSize > 0) {
                this.dealsService.previousPageIndex =
                    Math.ceil(this.totalLength / this.dealsService.previousPageSize) - 1;
                this.dealsService.reloadDeals().subscribe(response => {
                    this.dealsService.dealsList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            }
        });
    }

    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.dealsList.unsubscribe();
        this.filterValueChanges.unsubscribe();
    }

    createFilterFormGroup() {
        const group: any = {};
        group['url'] = new FormControl('');
        group['shopId'] = new FormControl(this.shopId);
        // group['collection'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        this.dealsService.getDeals(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: DealsListResponse) => {
                this.dealsService.dealsList.next(response);
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

    addNewDealModal() {
        this.modalRef = this.dialog.open(NewDealComponent, {
            disableClose: true,
            height: '90%',
            data: {
                urls: this.urls,
                shopId: this.shopId,
                shops: this.shops,
            }
        });
        this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
    }

    editDealModal(dealId: string) {
        this.modalRef = this.dialog.open(EditDealComponent, {
            height: '90%',
            width: '90%',
            data: {
                dealId: dealId,
                urls: this.urls,
                shopId: this.shopId,
                shops: this.shops,
            }
        });
        this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
    }

    getDealToDelete(data: Deal) {
        this.dealsService.getDeal(data.id).subscribe(response => {
            data = response.data;
            this.confirmDeleteDeal(data);
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        );
    }

    confirmDeleteDeal(data: Deal) {
        this.modalRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                titleKey: titleKey,
                okBtnKey: deleteBtnKey,
                messageKey: messageKey,
                messageParam: { param: data.id }
            }
        });

        this.modalRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteDeal(data);
            }
        });
    }

    deleteDeal(data: Deal): void {
        this.dealsService.deleteDeal(data.id).subscribe(response => {
            this.dealsService.reloadDeals().subscribe(resp => {
                this.dealsService.dealsList.next(resp);
                this.toastr.success(deletedMessageKey);
                this.loadPage();
            },
                (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            }
        );
    }

    getUrl(id: string) {
        try {
            return this.urls.find(url => {
                return url.id === id;
            }).url;
        } catch (err) {
            return;
        }

    }
}

