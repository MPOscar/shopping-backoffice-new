import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ConfigService } from '../../../../../config/services/config.service';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { ReleaseService } from "../../services/releases.service";
import { ReleaseImagesService } from "../../services/releases-images.service";
import { Release, ReleasesListResponse } from "../../models/releases";
import { GENDERS, Gender } from '../../models/gender';
import { Brand } from '../../../ms-brands/models/brand';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';
import { Collection } from '../../../ms-collections/models/collection';
import { NewReleaseModalComponent } from '../new-release-modal/new-release-modal.component';
import { EditReleaseModalComponent } from '../edit-release-modal/edit-release-modal.component';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Release?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
    selector: 'releases-collection-table',
    templateUrl: './releases-collection-table.component.html',
    styleUrls: ['./releases-collection-table.component.scss']
})
export class ReleasesCollectionTableComponent implements OnInit {

    @Input() brands: Array<Brand>;

    @Input() styles: Array<Style>;

    @Input() collections: Array<Collection>;

    @Input() disabled: boolean = false;

    displayedColumns: string[] = [
        'name',
        'mainImage',
        'sku',
        'styleId',
        'brandId',
        'collectionId',
        'categoryId',
        'color',
        'releaseDate',
        'createdAt',
        'actions'
    ];

    filter: FormGroup;

    filterValueChanges: Subscription;

    genders: Gender[] = GENDERS;

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    @Input() collectionId: string;

    modalRef: MatDialogRef<NewReleaseModalComponent | EditReleaseModalComponent | ConfirmDialogComponent>;

    totalLength: number = 0;

    releasesList: Subscription;

    releases: Array<Release> = [];

    @Input() shops: Array<Shop>;

    @Output() newRelease = new EventEmitter();

    constructor(
        public activatedRoute: ActivatedRoute,
        public configService: ConfigService,
        public dialog: MatDialog,
        public errorHandlingService: ErrorHandlingService,
        public releasesService: ReleaseService,
        public releaseImagesService: ReleaseImagesService,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.loadPage();

        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        this.releasesList = this.releasesService.releasesList.subscribe((stylesList: any) => {
            this.totalLength = stylesList.dataCount;
            this.releases = stylesList.data;
            this.changeDetectorRefs.detectChanges();
            if (this.releases.length === 0 && this.totalLength > 0 && this.releasesService.previousPageSize > 0) {
                this.releasesService.previousPageIndex =
                    Math.ceil(this.totalLength / this.releasesService.previousPageSize) - 1;
                this.releasesService.reloadReleases().subscribe(response => {
                    this.releasesService.releasesList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            }
        });
    }


    ngAfterViewInit() {
        if (this.collectionId) {
            this.loadPage();
        }
    }

    ngOnDestroy() {
        this.releasesList.unsubscribe();
        this.filterValueChanges.unsubscribe();
        this.releases = null;
    }

    createFilterFormGroup() {
        let group: any = {};
        group['collectionId'] = new FormControl(this.collectionId);
        return new FormGroup(group);
    }

    loadPage() {
        if (this.collectionId) {
            this.filter = this.createFilterFormGroup();
            this.releasesService.getReleases(
                Object.assign({}, this.filter.value),
                this.sort.active, this.sort.direction,
                this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: ReleasesListResponse) => {
                    this.releasesService.releasesList.next(response);
                },
                    (err: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, err)
                    });
        } else {
            this.releases = [];
        }
    }

    reloadPage() {
        this.releasesService.reloadReleases().subscribe(response => {
            this.releasesService.releasesList.next(response);
            this.totalLength = response.dataCount;
            this.releases = response.data;
            this.changeDetectorRefs.detectChanges();
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

    getBrand(id: string) {
        try {
            return this.brands.find(brand => {
                return brand.id === id;
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

    getStyle(id: string) {
        try {
            return this.styles.find(style => {
                return style.id === id;
            }).name;
        }
        catch (err) {
            return;
        }

    }

    addNewReleaseModal() {
        this.modalRef = this.dialog.open(NewReleaseModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                brands: this.brands,
                collectionId: this.collectionId,
                collections: this.collections,
                styles: this.styles,
                shops: this.shops
            }
        });
        this.modalRef.afterClosed().subscribe((newReleaseId) => {
            this.newRelease.emit(newReleaseId);
            this.loadPage();
        });
    }

    editReleaseModal(releaseId: string) {
        this.releaseImagesService.getReleaseAllImages(releaseId).subscribe(images => {

            this.modalRef = this.dialog.open(EditReleaseModalComponent, {
                height: '90%',
                width: '90%',
                data: {
                    shops: this.shops,
                    brands: this.brands,
                    collections: this.collections,
                    collectionId: this.collectionId,
                    releaseId: releaseId,
                    styles: this.styles,
                    imageList: images.data,
                    releases: this.releases
                }
            });

            this.modalRef.afterClosed().subscribe(() => {
                this.reloadPage();
            });

        });
    }
}

