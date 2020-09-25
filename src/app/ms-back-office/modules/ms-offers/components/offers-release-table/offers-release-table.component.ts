import { AfterViewInit, Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
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

import { EditOfferComponent } from '../edit-offer/edit-offer.component';
import { DeleteOfferComponent } from '../delete-offer/delete-offer.component';
import { NewOfferReleaseCreatorComponent } from '../new-offer-release-creator/new-offer-release-creator.component';
import { EditOfferReleaseCreatorComponent } from '../edit-offer-release-creator/edit-offer-release-creator.component';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Offer?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

const timeZoneOffset = new Date().getTimezoneOffset();


@Component({
    selector: 'offers-release-table',
    templateUrl: './offers-release-table.component.html',
    styleUrls: ['./offers-release-table.component.scss']
})

export class OffersReleaseTableComponent implements AfterViewInit, OnInit, OnDestroy {
    numberOfOffers: number;


    displayedColumns: string[] = [
        'shopId',
        'officialRelease',
        'status',
        // 'shiping',
        'updatedAt',
        'actions'
    ];

    @Input() collections: Array<Collection>;

    @Input() customized: boolean;

    @Input() disabled: boolean = false;

    filter: FormGroup;

    modalRef: MatDialogRef<NewOfferReleaseCreatorComponent | EditOfferReleaseCreatorComponent | ConfirmDialogComponent>;

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    @ViewChild(DeleteOfferComponent) deleteOfferComponent: DeleteOfferComponent;

    totalLength: number = 0;

    offers: Array<Offer> = [];

    @Input() release: Release;

    @Input() releases: Array<Release>;

    @Input() shops: Array<Shop>;

    @Input() sortByRank = false;

    @Input() releaseId: string;

    @Input() offerId: string;

    timeZoneOffset = 60;

    subscriptions: Subscription[] = [];

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public offersService: OffersService,
        public errorHandlingService: ErrorHandlingService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        if (this.disabled) {
            this.displayedColumns = [
                'shopId',
                'officialRelease',
                'status',
                // 'shiping',
                'updatedAt',
            ];
        }

        this.filter = this.createFilterFormGroup();
        const subFilterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());

        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        const subOffersList = this.offersService.offersList.subscribe((offersList: any) => {
            this.totalLength = offersList.dataCount;
            this.offers = offersList.data;
            this.numberOfOffers = this.offers.length;
            if (this.offers.length === 0 && this.totalLength > 0 && this.offersService.previousPageSize > 0) {
                this.offersService.previousPageIndex =
                    Math.ceil(this.totalLength / this.offersService.previousPageSize) - 1;
                const subReloadOffer = this.offersService.reloadOffers().subscribe(response => {
                    if (this.sortByRank && response.data) {
                        const shopsToSearch = this.shops;
                        response.data.forEach(item => {
                            item.shopRank = shopsToSearch.find(shop => {
                                return shop.id === item.shopId;
                            }).rank;
                            if (!item.shopRank) {
                                item.shopRank = 1e9;
                            }
                        });
                        response.data.sort((a, b) => a.shopRank - b.shopRank);
                    }
                    this.offersService.offersList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
                );
                this.subscriptions.push(subReloadOffer);
            }
        });
        this.subscriptions.push(subOffersList, subFilterValueChanges);
    }

    ngAfterViewInit() {
        this.loadPage();
        // this.editOfferModal(this.offerId);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }

    createFilterFormGroup() {
        const group: any = {};
        group['releaseId'] = new FormControl(this.releaseId ? this.releaseId : 'null');
        return new FormGroup(group);
    }

    loadPage() {
        const subGetOffers = this.offersService.getOffers(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: OffersListResponse) => {
                if (this.sortByRank && response.data) {
                    const shopsToSearch = this.shops;
                    response.data.forEach(item => {
                        item.shopRank = shopsToSearch.find(shop => {
                            return shop.id === item.shopId;
                        }).rank;
                        if (!item.shopRank) {
                            item.shopRank = 1e9;
                        }
                    });
                    response.data.sort((a, b) => a.shopRank - b.shopRank);
                }
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
            return this.collections.find(collection => {
                return collection.id === id;
            }).name;
        }
        catch (err) {
            return;
        }

    }

    getCollection(id: string) {
        try {
            return this.collections.find(collection => {
                return collection.id === id;
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
        const usedShopsIds = this.offers.map(offer => offer.shopId);
        this.modalRef = this.dialog.open(NewOfferReleaseCreatorComponent, {
            height: '90%',
            data: {
                shops: this.shops.filter(offerShop => usedShopsIds.indexOf(offerShop.id) === -1),
                releaseId: this.releaseId,
                customized: this.customized,
                releases: this.releases
            }
        });
        const subModal = this.modalRef.afterClosed().subscribe((response: Offer[]) => {
            if (response) {
                const subPostOffer = this.offersService.postOffers(response).subscribe(response => {
                    this.loadPage();
                });
                this.subscriptions.push(subPostOffer);
            }
        });
        this.subscriptions.push(subModal);
    }

    editOfferModal(offer: Offer) {
        this.modalRef = this.dialog.open(EditOfferReleaseCreatorComponent, {
            height: '90%',
            data: {
                data: offer,
                shops: this.shops,
                releaseId: this.releaseId,
                releases: this.releases,
                shopId: offer.shopId
            }
        });
        const subModal = this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
        this.subscriptions.push(subModal);
    }

    //delete
    getOfferToDelete(data: Offer) {
        const subGetOffer = this.offersService.getOffer(data.id).subscribe(response => {
            data = response.data;
            this.confirmDeleteOffer(data);
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        )
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

        const subModal = this.modalRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteOffer(data);
            }
        });
        this.subscriptions.push(subModal);
    }

    deleteOffer(data: Offer): void {
        const subDeleteOffer = this.offersService.deleteOffer(data.id).subscribe(response => {
            const subReloadOffer = this.offersService.reloadOffers().subscribe(response => {
                this.offersService.offersList.next(response);
                this.toastr.success(deletedMessageKey);
                this.loadPage();
            },
                (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
            );
            this.subscriptions.push(subReloadOffer);
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            }
        );
        this.subscriptions.push(subDeleteOffer);

    }
}

