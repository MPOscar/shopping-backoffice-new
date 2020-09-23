import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//
import {  MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { debounceTime, filter, switchMap, catchError, tap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { SeeStyleComponent } from '../see-style/see-style.component';
import { StylesService } from '../../services/styles.service';
import { Style, StylesListResponse } from '../../models/style';
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { DialogService } from 'src/app/ui/services/dialog.service';
import { ToastrService } from 'src/app/error-handling/services/toastr.service';

const errorKey = 'Error';

const timeZoneOffset = new Date().getTimezoneOffset();

@Component({
    selector: 'styles-table',
    templateUrl: './styles-table.component.html',
    styleUrls: ['./styles-table.component.scss']
})
export class StyleTableComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = [
        'name',
        'parent',
        'brand',
        //'collection',
        'category',
        'updatedAt',
        'actions'
    ];

    brands: Array<Brand>;

    categories: Array<Category>;

    filter: FormGroup;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength: number = 0;

    styles: Array<Style> = [];

    styless: Array<Style>

    timeZoneOffset = 60;

    modalRef: MatDialogRef<SeeStyleComponent>;

    subscriptions: Subscription[] = []

    constructor(
        private dialogService: DialogService,
        public activatedRoute: ActivatedRoute,
        public stylesService: StylesService,
        public errorHandlingService: ErrorHandlingService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        const filterValueChangesSubs = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        this.brands = this.activatedRoute.snapshot.data.brands;
        this.categories = this.activatedRoute.snapshot.data.categories;
        this.styless = this.activatedRoute.snapshot.data.styles;

        // Begin observing style list changes.
        const listSub = this.stylesService.stylesList.subscribe(
            (stylesList: any) => {
                this.totalLength = stylesList.dataCount;
                this.styles = stylesList.data;
                if (
                    this.styles.length === 0 &&
                    this.totalLength > 0 &&
                    this.stylesService.previousPageSize > 0
                ) {
                    const totalLength = this.totalLength;
                    const previousPageSize = this.stylesService.previousPageSize
                    this.stylesService.previousPageIndex = Math.ceil(totalLength / previousPageSize) - 1;

                    const sub = this.stylesService.reloadStyles().subscribe(
                        response => {
                            this.stylesService.stylesList.next(response);
                        },
                        (error: HandledError) =>
                            this.errorHandlingService.handleUiError(
                                errorKey,
                                error
                            )
                    );
                    this.subscriptions.push(sub);
                }
            }
        );

        this.subscriptions.push(listSub, filterValueChangesSubs)
    }


    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe())
    }

    createFilterFormGroup() {
        let group: any = {};
        group['name'] = new FormControl('');
        group['brand'] = new FormControl('');
        group['category'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        const sub = this.stylesService
            .getStyles(
                Object.assign({}, this.filter.value),
                this.sort.active,
                this.sort.direction,
                this.paginator.pageIndex,
                this.paginator.pageSize
            )
            .subscribe(
                (response: StylesListResponse) => {
                    this.stylesService.stylesList.next(response);
                },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err);
                }
            );
        this.subscriptions.push(sub);
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

    getCategories(ids: string[]) {
        try {
            return this.categories
                .filter(c => ids.includes(c.id))
                .map(c => c.name)
                .join(', ')
        }
        catch (err) {
            return;
        }
    }

    getParent(id: string) {
        try {
            return this.styles.find(style => {
                return style.id === id;
            }).name;
        }
        catch (err) {
            return;
        }
    }

    seeStyleModal(id: string) {
        const sub = this.stylesService.getStyle(id).subscribe(response => {
            this.dialogService.customDialogComponent(SeeStyleComponent, {
                data: {
                    id: id,
                    styles: this.styless,
                    brands: this.brands,
                    categories: this.categories,
                    data: response.data
                }
            });
        });
        this.subscriptions.push(sub);
    }

    deleteStyle(styleId) {
        const titleKey = 'Delete';
        const deleteBtnKey = 'Delete';
        const messageKey = 'Are you sure you want to delete this Style?';
        const errorKey = 'Error';
        const deletedMessageKey = 'Deleted';

        const sub = this.dialogService.confirm({
            titleKey: titleKey,
            okBtnKey: deleteBtnKey,
            messageKey: messageKey
        }).pipe(
            filter(confirmed => confirmed),
            switchMap(() => {
                return this.stylesService.deleteStyle(styleId).pipe(
                    catchError((error: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, error);
                        return of(null);
                    })
                )
            }),
            switchMap((res) => {
                if (res) {
                    return this.stylesService.reloadStyles().pipe(
                        catchError((error: HandledError) => {
                            this.errorHandlingService.handleUiError(errorKey, error);
                            return of(null);
                        })
                    )
                }
                return of(null)
            }),
            tap(response => {
                if (response) {
                    this.stylesService.stylesList.next(response);
                    this.toastr.success(deletedMessageKey)
                }
            })
        ).subscribe()

        this.subscriptions.push(sub);
    }
}

