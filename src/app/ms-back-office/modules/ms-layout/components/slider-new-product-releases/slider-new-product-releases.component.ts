import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ConfigService } from '../../../../../config/services/config.service';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { Style } from '../../../ms-style/models/style';
import { Collection } from '../../../ms-collections/models/collection';
import { Brand } from '../../../ms-brands/models/brand';
import { Gender, GENDERS } from '../../../ms-releases/models/gender';
import { Release, ReleaseImage, ReleasesListResponse } from '../../../ms-releases/models/releases';
import { ReleaseService } from '../../../ms-releases/services/releases.service';
import { ReleaseImagesService } from '../../../ms-releases/services/releases-images.service';

const errorKey = 'Error';

const timeZoneOffset = new Date().getTimezoneOffset();


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'slider-new-product-releases',
  templateUrl: './slider-new-product-releases.component.html',
  styleUrls: ['./slider-new-product-releases.component.scss']
})


export class SlidersNewProductReleasesComponent implements OnInit, OnDestroy, AfterViewInit {

    displayedColumns: string[] = [
        'name',
        'mainImage',
        'description',
        'createdAt',
        'actions'
    ];

    @Output() accept = new EventEmitter<any>();

    filter: FormGroup;

    filterValueChanges: Subscription;

    genders: Gender[] = GENDERS;

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength = 0;

    releasesList: Subscription;

    releases: Array<Release> = [];

    timeZoneOffset = 60;

    constructor(
        public activatedRoute: ActivatedRoute,
        public configService: ConfigService,
        public errorHandlingService: ErrorHandlingService,
        public releasesService: ReleaseService,
        private router: Router
    ) {
    }

    ngOnInit() {

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
        const group: any = {};
        group['name'] = new FormControl('');
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

    selectedProduct(element: any) {
        this.accept.emit(element);
      }

}

