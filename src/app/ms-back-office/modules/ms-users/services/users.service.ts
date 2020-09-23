import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { User, UsersListResponse, UsersResponse } from '../models/users';

export const ASCENDING = 'asc';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'firstName';

    previousSortDirection: string = 'asc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public usersList = new BehaviorSubject<UsersListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
        this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.users.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getUsers(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<UsersListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<UsersListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a brand for example.
    //

    reloadUsers(): Observable<UsersListResponse> {
        return this.getUsers(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postUser(data: User): Observable<User> {
        return this.http.post<User>(this.apiEndpoint, JSON.stringify(data));
    }

    getUser(id: string): Observable<UsersResponse> {
        return this.http.get<UsersResponse>(this.apiEndpoint + id + '/');
    }

    patchUser(data: User): Observable<User> {
        return this.http.patch<User>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

        if (filter.search && filter.search.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `search=${filter.search}`;
        }

        if (sortColumn) {
            let ordering = '';

            if (sortDirection === 'desc') {
                ordering = '-';
            }
            ordering += sortColumn;
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `ordering=${ordering}`;
        }

        if (pageIndex !== undefined) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `offset=${pageIndex * pageSize}`;
        }

        if (pageSize !== undefined) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `limit=${pageSize}`;
        }

        return queryParams;
    }

    //
    // End functions that most services have.
    //

    //
    // Begin special functions specific to only this service.
    //

    getAllUsers(): Observable<User[]> {
        return this.http.get<{ data: User[] }>(this.apiEndpoint)
            .pipe(map(response => {
                return response.data;
            }));
    }

    //
    // End special functions specific to only this service.
    //

}

