import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { LayoutSlider, UrlsListResponse, UrlsResponse, LayoutHeading } from '../models/layout';

export const ASCENDING = 'asc';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

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
        this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.layouts.apiEndpoint;
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

    postUrl(data: LayoutSlider): Observable<LayoutSlider> {

        return this.http.post<LayoutSlider>(this.apiEndpoint, JSON.stringify(data));
    }

    getLayout(pageId: string, layoutPage: string): Observable<UrlsResponse> {

        return this.http.get<UrlsResponse>(this.apiEndpoint + pageId + '/' + layoutPage);
    }

    getLayoutFilterSliders(pageId: string, layoutPage: string, filter: Array<any>): Observable<any> {

        let filters = this.formatFilters(filter);

        return this.http.get<any>(this.apiEndpoint + pageId + '/' + layoutPage + filters);
    }

    putLayoutHeading(pageId: string, layoutPage: string, data: LayoutHeading): Observable<LayoutHeading> {
        data.images = undefined;
        return this.http.put<LayoutHeading>(this.apiEndpoint + pageId + '/' + layoutPage + '/', JSON.stringify(data));
    }

    deleteUrl(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    getOurPartners(pageId: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + pageId + '/ourpartners_tabs');
    }

    postOurPartners(pageId: string, data: any): Observable<any> {
        return this.http.post<LayoutSlider>(this.apiEndpoint + pageId + '/ourpartners_tabs', JSON.stringify(data));
    }

    putOurPartners(pageId: string, data: any, tabId: string): Observable<any> {
        return this.http.put<LayoutSlider>(this.apiEndpoint + pageId + '/ourpartners_tabs/' + tabId, JSON.stringify(data));
    }

    deleteOurPartners(pageId: string, tabId: string): Observable<any> {
        return this.http.delete<LayoutSlider>(this.apiEndpoint + pageId + '/ourpartners_tabs/' + tabId);
    }

    getSliders(pageId: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + pageId + '/slider');
    }

    putSliders(pageId: string, data: any): Observable<any> {
        return this.http.put<LayoutSlider>(this.apiEndpoint + pageId + '/slider/', JSON.stringify(data));
    }

    getMenu(pageId: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + pageId + '/menu');
    }

    putMenu(pageId: string, data: any): Observable<any> {
        return this.http.put<LayoutSlider>(this.apiEndpoint + pageId + '/menu/', JSON.stringify(data));
    }

    getHeader(pageId: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + pageId + '/header');
    }

    putHeader(pageId: string, data: any): Observable<any> {
        return this.http.put<LayoutSlider>(this.apiEndpoint + pageId + '/header/', JSON.stringify(data));
    }

    getHottest(pageId: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + pageId + '/hottest');
    }

    putHottest(pageId: string, data: any): Observable<any> {
        return this.http.put<LayoutSlider>(this.apiEndpoint + pageId + '/hottest/', JSON.stringify(data));
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

    getAllUrls(): Observable<LayoutSlider[]> {
        return this.http.get<{ data: LayoutSlider[] }>(this.apiEndpoint)
            .pipe(map(response => {
                return response.data;
            }));
    }

    formatFilters(filters: Array<any>) {
        let queryParams = '';
        if (filters) {
            filters.forEach(item => {
                queryParams += queryParams.length > 0 ? '&' : '?';
                queryParams += item.filter + '=' + item.value;
            })
        }
        return queryParams;
    }
    //
    // End special functions specific to only this service.
    //

}

