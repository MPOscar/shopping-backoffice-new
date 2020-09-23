import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { SeeOfferComponent } from '../see-offer/see-offer.component';
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
import { STATUS, Status, OFFERS_STATUS } from '../../models/status';

import { NewOfferComponent } from '../new-offer/new-offer.component';
import { EditOfferComponent } from '../edit-offer/edit-offer.component';
import { DeleteOfferComponent } from '../delete-offer/delete-offer.component';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Offer?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

const timeZoneOffset = new Date().getTimezoneOffset();

@Component({
    selector: 'offers-table',
    templateUrl: './offers-table.component.html',
    styleUrls: ['./offers-table.component.scss']
})
export class OffersTableComponent implements AfterViewInit, OnInit {

    displayedColumns: string[] = [
        'shopId',
        // 'sku',
        'mainImage',
        'releaseId',
        // 'collectionId',
        // 'color',
        'offerDate',
        'status',
        // 'shipping',
        'updatedAt',
        'actions'
    ];

    collections: Array<Collection>;

    filter: FormGroup;

    filterValueChanges: Subscription;

    modalRef: MatDialogRef<NewOfferComponent | EditOfferComponent | ConfirmDialogComponent | SeeOfferComponent>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    @ViewChild(DeleteOfferComponent) deleteOfferComponent: DeleteOfferComponent;

    totalLength: number = 0;

    offersList: Subscription;

    offers: Array<Offer> = [];

    releases: Array<Release>;

    shops: Array<Shop>;

    shop: Shop;

    status: Array<Status> = OFFERS_STATUS;

    @Input() releaseId: string;

    timeZoneOffset = 60;

    data: any;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public offersService: OffersService,
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
        group['sku'] = new FormControl('');
        group['collectionId'] = new FormControl('');
        group['shopId'] = new FormControl('');
        group['status'] = new FormControl('');
        return new FormGroup(group);
    }

    changeStatus(offerData: Offer) {
        offerData.status = 'restock';
        this.offersService.putOffer(offerData).subscribe(response => {
            this.loadPage();
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });
    }

    loadPage() {
        this.offersService.getOffers(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: OffersListResponse) => {
                this.offersService.offersList.next(response);
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

    getReleaseImage(id: string) {
        try {
            return this.releases.find(release => {
                return release.id === id;
            }).mainImage;
        }
        catch (err) {
            return;
        }

    }

    getReleaseIdFromCollection(id: string) {
        try {
            let releaseId = this.releases.find(release => {
                return release.collectionId === id;
            }).id;

            if (releaseId) {
                return releaseId;
            } else if (id) {
                return '...';
            }

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
                releases: this.releases
            }
        });
        this.modalRef.afterClosed().subscribe(() => {
            this.loadPage();
        });
    }

    editOfferModal(offer: Offer) {
        this.modalRef = this.dialog.open(EditOfferComponent, {
            height: '90%',
            width: '90%',
            data: {
                offerId: offer.id,
                shopId: offer.shopId,
                shops: this.shops,
                releaseId: this.releaseId,
                releases: this.releases
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
        );
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

    getStatus(sta: string) {
        const status = this.status.find(s => {
            return s.id === sta;
        });
        return status ? status.name : '';
    }

    seeOfferModal(id: string) {

        this.offersService.getOffer(id).subscribe(response => {
            this.data = response.data;
            this.shop = this.shops ? this.shops.find((shop) => shop.id === this.data.shopId) : new Shop;

            this.modalRef = this.dialog.open(SeeOfferComponent, {
                height: '750px',
                width: '800px',
                data: {
                    id: id,
                    collections: this.collections,
                    data: response.data,
                    releases: this.releases,
                    shops: this.shops,
                    shop: this.shop
                }
            });
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        );


    }

}

