import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ValidationErrors, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Collection } from '../../models/collection';
import { CollectionsService } from '../../services/collections.service';
import { NewCollectionComponent } from '../new-collection/new-collection.component';
import { Brand } from '../../../ms-brands/models/brand';
import { Release } from '../../../ms-releases/models/releases';
import { ReleaseService } from '../../../ms-releases/services/releases.service';
import { ReleasesCollectionTableComponent } from '../../../ms-releases/components/releases-collection-table/releases-collection-table.component';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';
import { LinkOffersCollentionModalComponent } from '../../../ms-offers/components/link-offers-collection/link-offers-collection-modal.component';
import { SelectedShop } from '../../../ms-shops/models/selected-shop';
import { ShopsCollectionModalComponent } from '../../../ms-shops/components/shops-collection-modal/shops-collection-modal.component';

const errorKey = 'Error';

const savedMessageKey = 'Saved';

@Component({
    selector: 'collection-creator',
    templateUrl: './collection-creator.component.html',
    styleUrls: ['./collection-creator.component.scss']
})
@Mixin([CanDeactivateMixin])
export class CollectionCreatorComponent implements AfterViewInit, CanDeactivateMixin, OnInit {

    brands: Array<Brand>;

    data: Collection = {
        name: "",
        brand: ""
    };

    collections: Array<Collection>;

    shops: Array<Shop>;

    releases: Array<Release>;

    styles: Array<Style>;
    // Begin Mixin code of the CanDeactivate class
    unsavedChanges = false;

    cancelBtnKey = 'No';

    okBtnKey = 'Yes';

    saveTitleKey = 'Discard Title';

    saveMessageKey = 'Discard Message';

    modalRef: MatDialogRef<NewCollectionComponent | ShopsCollectionModalComponent | LinkOffersCollentionModalComponent>;

    canDeactivate: () => Observable<boolean> | boolean;

    dataChanged: () => void;

    linkedShops: Array<SelectedShop>;

    validationErrors: ValidationErrors;

    collectionId: string;

    selectedCollection = new FormControl();

    selectedBrand = new FormControl();

    initialLinkedShops: Array<SelectedShop>;

    addedReleases: Array<string>;

    @ViewChild(ReleasesCollectionTableComponent) releasesCollectionTableComponent: ReleasesCollectionTableComponent;

    constructor(
        public activatedRoute: ActivatedRoute,
        public collectionsService: CollectionsService,
        private errorHandlingService: ErrorHandlingService,
        public router: Router,
        public releaseService: ReleaseService,
        private toastr: ToastrService,
        public dialog: MatDialog) {
    }

    ngOnInit() {
        this.collections = this.activatedRoute.snapshot.data.collections;
        this.brands = this.activatedRoute.snapshot.data.brands;
        this.releases = this.activatedRoute.snapshot.data.releases;
        this.shops = this.activatedRoute.snapshot.data.shops;
        this.styles = this.activatedRoute.snapshot.data.styles;

    }

    ngAfterViewInit() {
        this.releasesCollectionTableComponent.loadPage();
    }

    submit(data: Collection) {
        this.createUser(data);
    }

    cancel() {
        this.close();
    }

    close() {
        this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
    }

    createUser(data: Collection) {

        this.collectionsService.postCollection(data).subscribe(response => {
            this.unsavedChanges = false;
            this.close();
            this.toastr.success(savedMessageKey);
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
                this.validationErrors = error.formErrors;
            });
    }

    showModal() {
        this.modalRef = this.dialog.open(NewCollectionComponent, {
            height: '90%',
            data: { brands: this.brands }
        });
        this.modalRef.afterClosed().subscribe((id) => {
            if (id) {
                this.collectionsService.getAllCollections().subscribe((response) => {
                    this.collections = response;
                    const collection = this.collections.find(coll => coll.id === id);
                    this.selectedCollection.setValue(id);
                    this.changeCollection(id, collection.brand);
                });
            }

        });
    }

    linkOffersModal() {
        this.modalRef = this.dialog.open(LinkOffersCollentionModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                collectionId: this.collectionId,
                shops: this.shops,
                releases: this.releases
            }
        });
    }

    changeCollection(collectionId: string, brandId?: string) {
        this.collectionId = collectionId;
        this.selectedBrand.setValue(brandId);
        this.initialLinkedShops = [];
        this.addedReleases = [];
        if (collectionId) {
            this.collectionsService.getCollectionLinkedShops(collectionId).subscribe(response => {
                this.linkedShops = response.data;
                this.initialLinkedShops = [...this.linkedShops];

                this.releasesCollectionTableComponent.loadPage();
            },
                (error: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, error);
                });

        }
    }

    discardAllChanges() {
        this.linkInitialLinkedShops().then(response => {
            this.removeAddedReleases().then((removed) => {
                this.toastr.success('Done');
                this.changeCollection(this.selectedCollection.value, this.selectedBrand.value);
            }).catch(error => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });
        }).catch(error => {
            this.errorHandlingService.handleUiError(errorKey, error);
        });
    }

    linkInitialLinkedShops(): Promise<any> {
        return new Promise((resolve: (result) => void, reject: (reason) => void): void => {
            this.collectionsService.postCollectionLinkedShops(this.collectionId, this.initialLinkedShops).subscribe(response => {
                resolve(response);
            },
                (error: HandledError) => {
                    reject(error);
                });
        });
    }

    removeAddedReleases(): Promise<Array<any>> {
        return Promise.all(this.addedReleases.map(id => {
            return new Promise((resolve: (result) => void, reject: (reason) => void): void => {
                this.releaseService.deleteRelease(id).subscribe(response => {
                    resolve(response);
                },
                    (error: HandledError) => {
                        reject(error);
                    });
            });
        }));
    }

    newRelease(id: string) {
        this.addedReleases = [...this.addedReleases, id];
    }

}
