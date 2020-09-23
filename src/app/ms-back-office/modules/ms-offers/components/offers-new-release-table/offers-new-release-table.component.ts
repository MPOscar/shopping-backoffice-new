import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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

import { NewOfferReleaseCreatorComponent } from '../new-offer-release-creator/new-offer-release-creator.component';
import { EditOfferReleaseCreatorComponent } from '../edit-offer-release-creator/edit-offer-release-creator.component';
import { DeleteOfferComponent } from '../delete-offer/delete-offer.component';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Offer?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

const timeZoneOffset = new Date().getTimezoneOffset();


@Component({
    selector: 'offers-new-release-table',
    templateUrl: './offers-new-release-table.component.html',
    styleUrls: ['./offers-new-release-table.component.scss']
})

export class OffersNewReleaseTableComponent implements AfterViewInit, OnInit {
    editStatus = true;

    displayedColumns: string[] = [
        'shopId',
        'officialRelease',
        'status',
        //'shiping',
        'updatedAt',
        'actions'
    ];


    @Input() collections: Array<Collection>;

    @Input() customized: boolean;

    @Input() disabled: boolean = false;

    @Output() offersEventEmiter: EventEmitter<any> = new EventEmitter();

    filter: FormGroup;

    filterValueChanges: Subscription;

    modalRef: MatDialogRef<NewOfferReleaseCreatorComponent | EditOfferReleaseCreatorComponent | ConfirmDialogComponent>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    @ViewChild(DeleteOfferComponent) deleteOfferComponent: DeleteOfferComponent;

    totalLength: number = 0;

    offersList: Subscription;

    offers: Array<Offer> = [];

    @Input() release: Release;

    @Input() releases: Array<Release>;

    @Input() shops: Array<Shop>;

    @Input() releaseId: string;

    @Input() offerId: string;

    @Input() collectionNameForOffers: string;

    @Input() releaseDateForOffers: string;

    @Input() skuForOfers: string;

    @Input() colorsForOfers: string;

    numberOfOffers: number = 0;

    newOffers: Array<any>;

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
        if (this.disabled) {
            this.displayedColumns = [
                'sku',
                'collection',
                'color',
                'officialRelease',
                'shopId',
                'status',
                'updatedAt',
            ];
        }

        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        /*this.offersList = this.offersService.offersList.subscribe((offersList: any) => {
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
        });*/
    }

    ngAfterViewInit() {
        this.loadPage();
    }

    createFilterFormGroup() {
        const group: any = {};
        group['releaseId'] = new FormControl(this.releaseId ? this.releaseId : 'null');
        return new FormGroup(group);
    }

    loadPage() {
        this.offersService.getOffers(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((offerList: OffersListResponse) => {
                offerList.data = this.cleanOffers(offerList.data);
                this.offers = offerList.data;
                this.offersEventEmiter.emit(this.offers);
                this.totalLength = offerList.dataCount;
                if (this.offers.length === 0 && this.totalLength > 0 && this.offersService.previousPageSize > 0) {
                    this.offersService.previousPageIndex =
                        Math.ceil(this.totalLength / this.offersService.previousPageSize) - 1;
                    this.offersService.reloadOffers().subscribe(response => {
                        response.data = this.cleanOffers(response.data);
                        this.offersService.offersList.next(response);
                    },
                        (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
                } else {
                    this.offersService.offersList.next(offerList);
                }
            },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err)
                });
    }

    cleanOffers(offerList: Offer[]): Offer[] {
        for (const offer of offerList) {
            offer.id = undefined;
            offer.releaseId = undefined;
            offer.createdAt = undefined;
            offer.updatedAt = undefined;
            offer.links = [];
        }
        return offerList;
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
        this.modalRef = this.dialog.open(NewOfferReleaseCreatorComponent, {
            height: '90%',
            width: '90%',
            data: {
                shops: this.shops,
                releaseId: this.releaseId,
                customized: this.customized
            }
        });

        this.modalRef.afterClosed().subscribe((response: Offer[]) => {
            if (response) {
                response.forEach((offer: Offer) => {
                   offer.id = this.numberOfOffers.toLocaleString();
                   this.numberOfOffers ++;
                });
                this.offers = [...this.offers, ...response];
                this.offersEventEmiter.emit(this.offers);
            }
        });
    }

    editOfferModal(data: any) {
        this.editStatus = false;
        this.modalRef = this.dialog.open(EditOfferReleaseCreatorComponent, {
            height: '90%',
            width: '90%',
            data: {
                data: data,
                shops: this.shops,
                // releaseId: this.releaseId,
            }
        });

        this.modalRef.afterClosed().subscribe((response: Offer) => {
            if (response) {
                const index = this.offers.findIndex(item => {
                    return item.id === response.id;
                });
                this.offers[index] = response;
                this.offersEventEmiter.emit(this.offers);
                this.editStatus = true;
            }
        });
    }

    //delete
    getOfferToDelete(id: string) {
        let offersD = [];
        this.offers.forEach(item => {
            if (item.id !== id) {
                offersD = [...offersD, item];
            }
        });
        this.offers = offersD;
        this.offersEventEmiter.emit(this.offers);
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
        )
    }
}

