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
import { OffersService } from '../../services/offers.service';
import { Offer, OffersListResponse } from '../../models/offer';
import { Collection } from '../../../ms-collections/models/collection';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';
import { EditOfferComponent } from '../edit-offer/edit-offer.component';
import { DeleteOfferComponent } from '../delete-offer/delete-offer.component';
import { NewOfferShopCreatorComponent } from '../new-offer-shop-creator/new-offer-shop-creator.component';

const titleKey = 'Title Delete Offer';

const deleteBtnKey = 'Delete Offer';

const messageKey = 'Delete Offer';

const errorKey = 'Error';

const deletedOfferMessageKey = 'Deleted Offer';

const timeZoneOffset = new Date().getTimezoneOffset();

@Component({
    selector: 'offers-shop-table',
    templateUrl: './offers-shop-table.component.html',
    styleUrls: ['./offers-shop-table.component.scss']
})
export class OffersShopTableComponent implements AfterViewInit, OnInit, OnDestroy {

    displayedColumns: string[] = [
        'sku',
        'name',
        'collection',
        'color',
        'releaseDate',
        'status',
        // 'SHIPING',
        'updatedAt',
        // 'ACTION'
    ];

    filter: FormGroup;

    modalRef: MatDialogRef<NewOfferShopCreatorComponent | EditOfferComponent | ConfirmDialogComponent>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    @ViewChild(DeleteOfferComponent) deleteOfferComponent: DeleteOfferComponent;

    totalLength: number = 0;

    offers: Array<Offer> = [];

    @Input() collections: Array<Collection>;

    @Input() releases: Array<Release>;

    @Input() shops: Array<Shop>;

    @Input() shop: Shop;

    @Input() releaseId: string;

    @Input() shopId: string;

    timeZoneOffset = 60;

    subscriptions: Array<Subscription> = [];

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
        const subfilterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.subscriptions.push(subfilterValueChanges);
        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        const subOffersList = this.offersService.offersList.subscribe((offersList: any) => {
            this.totalLength = offersList.dataCount;
            this.offers = offersList.data;
            if (this.offers.length === 0 && this.totalLength > 0 && this.offersService.previousPageSize > 0) {
                this.offersService.previousPageIndex =
                    Math.ceil(this.totalLength / this.offersService.previousPageSize) - 1;
                const subReloadOffers = this.offersService.reloadOffers().subscribe(response => {
                    this.offersService.offersList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
                this.subscriptions.push(subReloadOffers);
            }
        });
        this.subscriptions.push(subOffersList);
    }

    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    createFilterFormGroup() {
        let group: any = {};
        group['shopId'] = new FormControl(this.shopId);
        return new FormGroup(group);
    }

    loadPage() {
        const subGetOffers = this.offersService.getOffers(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: OffersListResponse) => {
                this.offersService.offersList.next(response);
            },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err);
                });
        this.subscriptions.push(subGetOffers);
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
            return '';
        }

    }

    getReleaseSku(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).sku;
        }
        catch (err) {
            return '';
        }

    }

    getReleaseDate(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).updatedAt;
        }
        catch (err) {
            return '';
        }

    }

    getReleaseColor(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).color;
        }
        catch (err) {
            return '';
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
            return '';
        }

    }

    getShop(id: string) {
        try {
            return this.shops.find(shop => {
                return shop.id === id;
            }).name;
        }
        catch (err) {
            return '';
        }

    }


    addNewOfferModal() {
        this.modalRef = this.dialog.open(NewOfferShopCreatorComponent, {
            height: '90%',
            width: '90%',
            data: {
                shop: this.shop,
                shops: this.shops,
                releases: this.releases,
                releaseId: this.releaseId,
                shopId: this.shopId,
            },
            disableClose: true
        });
        const subAfterClosed = this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
        this.subscriptions.push(subAfterClosed);
    }

    editOfferModal(offerId: string) {
        this.modalRef = this.dialog.open(EditOfferComponent, {
            height: '90%',
            width: '90%',
            data: {
                offerId: offerId,
                shop: this.shop,
                shops: this.shops,
                releaseId: this.releaseId,
                shopId: this.shopId,
            }
        });
        const subAfterClosed = this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
        this.subscriptions.push(subAfterClosed);
    }

    getOfferToDelete(data: Offer) {
        const subGetOffer = this.offersService.getOffer(data.id).subscribe(response => {
            data = response.data;
            this.confirmDeleteOffer(data);
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        );
        this.subscriptions.push(subGetOffer);
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

        const subAfterClosed = this.modalRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteOffer(data);
            }
        });
        this.subscriptions.push(subAfterClosed);
    }

    deleteOffer(data: Offer): void {
        const subDeleteOffer = this.offersService.deleteOffer(data.id).subscribe(response => {
            const subReloadOffers = this.offersService.reloadOffers().subscribe(response => {
                this.offersService.offersList.next(response);
                this.toastr.success(deletedOfferMessageKey);
                this.loadPage();
            },
                (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            this.subscriptions.push(subReloadOffers);
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            }
        );
        this.subscriptions.push(subDeleteOffer);
    }
}

