import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
//
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { CategoriesService } from '../../services/categories.service';
import { Category, CategoriesListResponse } from '../../models/category';

const errorKey = 'Error';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'categories-table',
    templateUrl: './categories-table.component.html',
    styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent implements OnInit, OnDestroy, AfterViewInit {

    displayedColumns: string[] = [
        'name',
        'description',
        'actions'
    ];

    filter: FormGroup;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength = 0;

    categories: Array<Category> = [];

    subscriptions: Subscription[] = [];

    constructor(
        public categoriesService: CategoriesService,
        public errorHandlingService: ErrorHandlingService
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        const filterValueChangesSub = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFilter());
        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        const categoriesListSub = this.categoriesService.categoriesList.subscribe((categoriesList: any) => {
            this.totalLength = categoriesList.dataCount;
            this.categories = categoriesList.data;
            if (
                this.categories.length === 0 &&
                this.totalLength > 0 &&
                this.categoriesService.previousPageSize > 0
            ) {
                this.categoriesService.previousPageIndex =
                    Math.ceil(this.totalLength / this.categoriesService.previousPageSize) - 1;

                const sub = this.categoriesService.reloadCategories().subscribe(
                    response => {
                        this.categoriesService.categoriesList.next(response);
                    },
                    (error: HandledError) =>
                        this.errorHandlingService.handleUiError(errorKey, error)
                );
                this.subscriptions.push(sub);
            }
        });
        this.subscriptions.push(filterValueChangesSub, categoriesListSub);
    }


    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    createFilterFormGroup() {
        const group: any = {};
        group['name'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        const sub = this.categoriesService
            .getCategories(
                Object.assign({}, this.filter.value),
                this.sort.active,
                this.sort.direction,
                this.paginator.pageIndex,
                this.paginator.pageSize
            )
            .subscribe(
                (response: CategoriesListResponse) => {
                    this.categoriesService.categoriesList.next(response);
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

}

