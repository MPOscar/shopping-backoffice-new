import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Url, UrlsListResponse, UrlsResponse } from '../models/urls';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'url';

    previousSortDirection: string = 'asc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public urlsList = new BehaviorSubject<UrlsListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.urls.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getUrls(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<UrlsListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<UrlsListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a Url for example.
    //

    reloadUrls(): Observable<UrlsListResponse> {
        return this.getUrls(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postUrl(data: Url): Observable<Url> {
        return this.http.post<Url>(this.apiEndpoint, JSON.stringify(data));
    }

    getUrl(id: string): Observable<UrlsResponse> {
        return this.http.get<UrlsResponse>(this.apiEndpoint + id + '/');
    }

    putUrl(data: Url): Observable<Url> {
        return this.http.put<Url>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteUrl(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

        if (filter.url && filter.url.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `url=${filter.url}`;
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

    getAllUrls(): Observable<Url[]> {
        return this.http.get<{ data: Url[] }>(this.apiEndpoint)
            .pipe(map(response => {
                return response.data;
            }));
    }

    //
    // End special functions specific to only this service.
    //

}

