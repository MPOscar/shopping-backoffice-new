import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Category, CategoriesListResponse, CategoriesResponse } from '../models/category';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn = 'name';

    previousSortDirection = 'asc';

    previousPageIndex = 0;

    previousPageSize = 100;

    public categoriesList = new BehaviorSubject<CategoriesListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.categories.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getCategories(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<CategoriesListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        const queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<CategoriesListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a category for example.
    //

    reloadCategories(): Observable<CategoriesListResponse> {
        return this.getCategories(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postCategory(data: Category): Observable<Category> {
        return this.http.post<Category>(this.apiEndpoint, JSON.stringify(data));
    }

    getCategory(id: string): Observable<CategoriesResponse> {
        return this.http.get<CategoriesResponse>(this.apiEndpoint + id + '/');
    }

    putCategory(data: Category): Observable<Category> {
        return this.http.put<Category>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteCategory(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

        if (filter.name && filter.name.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `name=${filter.name}`;
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

    getAllCategories(): Observable<Category[]> {
        return this.http.get<{ data: Category[] }>(this.apiEndpoint)
            .pipe(map(response => {
                response.data.sort(function (a, b) {
                    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
                });
                return response.data;
            }));
    }

    //
    // End special functions specific to only this service.
    //

}

