import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
//
import { OffersService } from "../../services/offers.service";
import { Offer, OffersListResponse } from "../../models/offer";
import { Collection } from '../../../ms-collections/models/collection';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';

import { NewOfferComponent } from '../new-offer/new-offer.component';
import { EditOfferComponent } from '../edit-offer/edit-offer.component';
import { DeleteOfferComponent } from '../delete-offer/delete-offer.component';

const titleKey = 'Title Delete Offer';

const deleteBtnKey = 'Delete Offer';

const messageKey = 'Delete Offer';

const errorKey = 'Error';

const deletedOfferMessageKey = 'Deleted Offer';

const timeZoneOffset = new Date().getTimezoneOffset();

@Component({
    selector: 'offers-collection-table',
    templateUrl: './offers-collection-table.component.html',
    styleUrls: ['./offers-collection-table.component.scss']
})
export class OffersCollectionTableComponent implements AfterViewInit, OnInit {

    displayedColumns: string[] = [
        'SKU',
        'RELEASE NAME',
        'COLLECTION',
        'COLOR',
        'OFFICIAL RELEASE',
        'SHOP',
        'STATUS',
        //'SHIPING',
        'UPDATED',
        //'ACTION'
    ];



    filter: FormGroup;

    filterValueChanges: Subscription;

    modalRef: MatDialogRef<NewOfferComponent | EditOfferComponent | ConfirmDialogComponent>;

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    @ViewChild(DeleteOfferComponent) deleteOfferComponent: DeleteOfferComponent;

    totalLength: number = 0;

    offersList: Subscription;

    offers: Array<Offer> = [];

    @Input() collections: Array<Collection>;

    @Input() releases: Array<Release>;

    @Input() shops: Array<Shop>;

    @Input() releaseId: string;

    timeZoneOffset = 60;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public offersService: OffersService,
        public errorHandlingService: ErrorHandlingService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        this.collections = this.activatedRoute.snapshot.data.collections;
        this.releases = this.activatedRoute.snapshot.data.releases;
        this.shops = this.activatedRoute.snapshot.data.shops;

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
        let group: any = {};
        //group['name'] = new FormControl('');
        //group['collection'] = new FormControl('');
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

    getReleaseName(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).name;
        }
        catch (err) {
            return;
        }

    }

    getReleaseSku(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).sku;
        }
        catch (err) {
            return;
        }

    }

    getReleaseDate(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).updatedAt;
        }
        catch (err) {
            return;
        }

    }

    getReleaseColor(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).color;
        }
        catch (err) {
            return;
        }

    }

    getCollectionNameRelease(id: string) {
        try {
            let collectionId = this.releases.find(release => {
                return release.id === id;
            }).collectionId;

            return this.collections.find(collection => {
                return collection.id === collectionId;
            }).name;
        }
        catch (err) {
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


    addNewOfferModal() {
        this.modalRef = this.dialog.open(NewOfferComponent, {
            height: '90%',
            width: '90%',
            data: {
                shops: this.shops,
                releaseId: this.releaseId,
            }
        });
        this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
    }

    editOfferModal(offerId: string) {
        this.modalRef = this.dialog.open(EditOfferComponent, {
            height: '90%',
            width: '90%',
            data: {
                offerId: offerId,
                shops: this.shops,
                releaseId: this.releaseId,
            }
        });
        this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
    }

    //delete
    getOfferToDelete(data: Offer) {
        this.offersService.getOffer(data.id).subscribe(response => {
            data = response.data;
            this.confirmDeleteOffer(data);
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        )
    }

    confirmDeleteOffer(data: Offer) {
        this.modalRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                titleKey: titleKey,
                okBtnKey: deleteBtnKey,
                messageKey: messageKey,
                messageParam: { param: data.name }
            }
        });

        this.modalRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteOffer(data);
            }
        });
    }

    deleteOffer(data: Offer): void {
        this.offersService.deleteOffer(data.id).subscribe(response => {
            this.offersService.reloadOffers().subscribe(response => {
                this.offersService.offersList.next(response);
                this.toastr.success(deletedOfferMessageKey);
                this.loadPage();
            },
                (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            }
        )
    }
}

