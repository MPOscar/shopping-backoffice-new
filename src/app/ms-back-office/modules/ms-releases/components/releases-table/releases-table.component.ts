import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { ConfigService } from '../../../../../config/services/config.service';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { EditReleaseModel, ReleaseImage } from '../../models/releases';
import { ReleaseService } from '../../services/releases.service';
import { ReleaseImagesService } from '../../services/releases-images.service';
import { Release, ReleasesListResponse } from "../../models/releases";
import { GENDERS, Gender } from '../../models/gender';
import { Brand } from '../../../ms-brands/models/brand';
import { Style } from '../../../ms-style/models/style';
import { Shop } from '../../../ms-shops/models/shops';
import { Collection } from '../../../ms-collections/models/collection';
import { SeeReleaseComponent } from '../see-release/see-release.component';

const errorKey = 'Error';

const timeZoneOffset = new Date().getTimezoneOffset();

@Component({
    selector: 'releases-table',
    templateUrl: './releases-table.component.html',
    styleUrls: ['./releases-table.component.scss']
})
export class ReleasesTableComponent implements OnInit {

    brands: Array<Brand>;

    styles: Array<Style>;

    collections: Array<Collection>;

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

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength: number = 0;

    releasesList: Subscription;

    releases: Array<Release> = [];

    timeZoneOffset = 60;

    modalRef: MatDialogRef<SeeReleaseComponent>;

    imageList: ReleaseImage[];

    shops: Array<Shop>;

    constructor(
        public dialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        public configService: ConfigService,
        public errorHandlingService: ErrorHandlingService,
        public releasesService: ReleaseService,
        public releaseImagesService: ReleaseImagesService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.brands = this.activatedRoute.snapshot.data.brands;
        this.collections = this.activatedRoute.snapshot.data.collections;
        this.imageList = this.activatedRoute.snapshot.data.releaseAllImages;
        this.shops = this.activatedRoute.snapshot.data.shops;
        this.styles = this.activatedRoute.snapshot.data.styles;

        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        this.releasesList = this.releasesService.releasesList.subscribe((stylesList: any) => {
            this.totalLength = stylesList.dataCount;
            this.releases = stylesList.data;
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
        this.loadPage();
    }

    ngOnDestroy() {
        this.releasesList.unsubscribe();
        this.filterValueChanges.unsubscribe();
    }

    createFilterFormGroup() {
        let group: any = {};
        group['sku'] = new FormControl('');
        group['name'] = new FormControl('');
        group['brandId'] = new FormControl('');
        group['collectionId'] = new FormControl('');
        group['gender'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        this.releasesService
            .getReleases(
                Object.assign({}, this.filter.value),
                this.sort.active,
                this.sort.direction,
                this.paginator.pageIndex,
                this.paginator.pageSize
            )
            .subscribe(
                (response: ReleasesListResponse) => {
                    this.releasesService.releasesList.next(response);
                },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err);
                }
            );
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

    copyRelease(id: string) {
        this.router.navigate(['../create'], { relativeTo: this.activatedRoute, queryParams: { id } });
    }

    seeReleaseModal(id: string) {

        this.releasesService.getRelease(id).subscribe(response => {

            this.releaseImagesService.getReleaseAllImages(id).subscribe(images => {

                this.modalRef = this.dialog.open(SeeReleaseComponent, {
                    height: '90%',
                    width: '95%',
                    data: {
                        id: id,
                        styles: this.styles,
                        brands: this.brands,
                        collections: this.collections,
                        data: response.data,
                        imageList: images.data,
                        shops: this.shops,
                    }
                });

            });

        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));

    }
}

