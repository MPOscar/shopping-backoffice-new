import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
//
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
//import { setTranslations } from '@cognitec/ngx-translate';
//import { TRANSLATIONS } from './i18n/annotation-tool-modal.component.translations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { Offer } from '../../models/offer';
//import { Landmarks } from '../../models/landmarks';
import { ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
//
import { OffersService } from "../../services/offers.service";
import { OffersListResponse } from "../../models/offer";
import { Collection } from '../../../ms-collections/models/collection';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';
import { CollectionsService } from '../../../ms-collections/services/collections.service';

const errorKey = 'Error';

@Component({
  selector: 'link-offers-collection-modal',
  templateUrl: './link-offers-collection-modal.component.html',
  styleUrls: ['./link-offers-collection-modal.component.css'],
})

export class LinkOffersCollentionModalComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'linked',
    'sku',
    'RELEASE NAME',
    'COLLECTION',
    'COLOR',
    'OFFICIAL RELEASE',
    'SHOP',
    'STATUS',
    ];

  collections: Array<Collection>;

  filter: FormGroup;

  filterValueChanges: Subscription;

  //modalRef: MatDialogRef<NewOfferComponent | EditOfferComponent | ConfirmDialogComponent>;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  totalLength: number = 0;

  offersList: Subscription;

  offers: Array<Offer> = [];

  releases: Array<Release>;

  shops: Array<Shop>;

  @Input() releaseId: string;

  answer = false;

  flag: boolean = true;

  imageSrc: any = null;

  linkedOffers: Array<string> = [];

  oldLinkedOffers: Array<string> = [];

  constructor(element: ElementRef,
    breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<LinkOffersCollentionModalComponent>,
    public errorHandlingService: ErrorHandlingService,
    public offersService: OffersService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    public collectionsService: CollectionsService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    //setTranslations(this.translateService, TRANSLATIONS);
    breakpointObserver.observe([
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {

      }
    });
  }

  ngOnInit() {
    this.filter = this.createFilterFormGroup();
    this.collectionsService.getCollectionLinkedOffers(this.dialogData.collectionId).subscribe(response => {
      this.linkedOffers = response.data;
      this.offers.forEach((offer) => {
        this.isLinked(offer.id);
      });
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
      });

    // Begin observing style list changes.
    this.offersList = this.offersService.offersList.subscribe((offersList: any) => {
      this.totalLength = offersList.dataCount;
      this.offers = offersList.data;
      this.offers.forEach((offer) => {
        this.isLinked(offer.id);
      });
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

  onAccept() {
    this.answer = true;
    this.close();
  }

  onCancel() {
    this.answer = false;
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.close();
  }

  createFilterFormGroup() {
    let group: any = {};
    group['releaseId'] = new FormControl('');
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

  linked(offer: Offer) {
    offer.linked = !offer.linked;
    if (offer.linked) {
      this.linkedOffers = [...this.linkedOffers, offer.id];
    } else {
      let indexLinked = this.linkedOffers.findIndex((val) => val === offer.id);
      if (indexLinked > -1) {
        let linked: Array<string> = [];
        this.linkedOffers.forEach((OfferId, index) => {
          if (index != indexLinked) {
            linked = [...linked, OfferId]
          }
        });
        this.linkedOffers = linked;

      }
    }
  }

  save() {
    this.collectionsService.postCollectionLinkedOffers(this.dialogData.collectionId, this.linkedOffers).subscribe(response => {
      this.close();
      this.toastr.success("Saved");
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
      });
  }

  isLinked(id: string) {
    let isLinked = this.linkedOffers.findIndex(offerId => offerId === id) > -1;
    if (isLinked) {
      let index = this.offers.findIndex(offer => offer.id === id);
      this.offers[index].linked = true;
      this.offers[index].checked = true;
    } else {
      let index = this.offers.findIndex(offer => offer.id === id);
      this.offers[index].linked = false;
      this.offers[index].checked = false;
    }
  }

  getReleaseName(id: string) {
    try {
        return this.dialogData.releases.find(release => {
            return release.id === id;
        }).name;
    }
    catch (err) {
        return;
    }
}

getReleaseSku(id: string) {
    try {
        return this.dialogData.releases.find(release => {
            return release.id === id;
        }).sku;
    }
    catch (err) {
        return;
    }
}

getReleaseDate(id: string) {
    try {
        return this.dialogData.releases.find(release => {
            return release.id === id;
        }).releaseDate;
    }
    catch (err) {
        return;
    }
}

getReleaseColor(id: string) {
    try {
        return this.dialogData.releases.find(release => {
            return release.id === id;
        }).color;
    }
    catch (err) {
        return;
    }
}

getCollectionNameRelease(id: string) {
    try {
        let collectionId = this.dialogData.releases.find(release => {
            return release.id === id;
        }).collectionId;

        return this.dialogData.collections.find(collection => {
            return collection.id === collectionId;
        }).name;
    }
    catch (err) {
        return;
    }
}

getShop(id: string) {
    try {
      return this.dialogData.shops.find(shop => {
        return shop.id === id;
      }).name;
    }
    catch (err) {
      return;
    }
  }

}
