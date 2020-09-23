import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
//
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { UsersService } from "../../services/users.service";
import { User, UsersListResponse } from "../../models/users";

const errorKey = 'Error';

@Component({
    selector: 'users-table',
    templateUrl: './users-table.component.html',
    styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

    displayedColumns: string[] = [
        'name', 'email', 'actions'
    ];

    filter: FormGroup;

    filterValueChanges: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    totalLength: number = 0;

    usersList: Subscription;

    users: Array<User> = [];

    constructor(
        public usersService: UsersService,
        public errorHandlingService: ErrorHandlingService
    ) {
    }

    ngOnInit() {
        this.filter = this.createFilterFormGroup();
        this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.onFilter());
        this.paginator.pageIndex = 0;

        // Begin observing style list changes.
        this.usersList = this.usersService.usersList.subscribe((usersService: any) => {
            this.totalLength = usersService.dataCount;
            this.users = usersService.data;
            if (this.users.length === 0 && this.totalLength > 0 && this.usersService.previousPageSize > 0) {
                this.usersService.previousPageIndex =
                    Math.ceil(this.totalLength / this.usersService.previousPageSize) - 1;
                this.usersService.reloadUsers().subscribe(response => {
                    this.usersService.usersList.next(response);
                },
                    (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
            }
        });
    }


    ngAfterViewInit() {
        this.loadPage();
    }

    ngOnDestroy() {
        this.usersList.unsubscribe();
        this.filterValueChanges.unsubscribe();
    }

    createFilterFormGroup() {
        let group: any = {};
        group['name'] = new FormControl('');
        group['status'] = new FormControl('');
        group['country'] = new FormControl('');
        return new FormGroup(group);
    }

    loadPage() {
        this.usersService.getUsers(
            Object.assign({}, this.filter.value),
            this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize).subscribe((response: UsersListResponse) => {
                this.usersService.usersList.next(response);
            },
                (err: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, err)
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

}

