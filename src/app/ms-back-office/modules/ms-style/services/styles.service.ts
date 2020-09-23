import { Injectable } from '@angular/core';
//
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Style, StylesListResponse, StyleResponse } from '../models/style';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
import { SelectedShop, SelectedShopListResponse } from '../../ms-shops/models/selected-shop';

export const ASCENDING = 'asc';

@Injectable({
    providedIn: 'root'
})
export class StylesService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'updatedAt';

    previousSortDirection: string = 'desc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public stylesList = new BehaviorSubject<StylesListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
        this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.styles.apiEndpoint;
    }

    getStyles(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<StylesListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);
        return this.http.get<StylesListResponse>(this.apiEndpoint + queryParams);
    }

    reloadStyles(): Observable<StylesListResponse> {
        return this.getStyles(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postStyle(data: Style): Observable<any> {
        return this.http.post<any>(this.apiEndpoint, JSON.stringify(data));
    }

    postStyleLinkedShops(id: string, data: Array<SelectedShop>): Observable<Style> {
        return this.http.post<Style>(this.apiEndpoint + id + '/shops/', JSON.stringify(data));
    }

    getStyleLinkedShops(id: string): Observable<SelectedShopListResponse> {
        return this.http.get<SelectedShopListResponse>(this.apiEndpoint + id + '/shops/');
    }

    getStyle(id: string): Observable<StyleResponse> {
        return this.http.get<StyleResponse>(this.apiEndpoint + id + '/');
    }

    putStyle(data: Style): Observable<Style> {
        return this.http.put<Style>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteStyle(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    getPopularStyle(brandId: string, ): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + 'popular/?brandId=' + brandId);
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

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

        if (filter.sku && filter.sku.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `sku=${filter.sku}`;
        }

        if (filter.name && filter.name.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `name=${filter.name}`;
        }

        if (filter.brand && filter.brand.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `brand=${filter.brand}`;
        }

        if (filter.collection && filter.collection.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `collection=${filter.collection}`;
        }

        if (filter.category && filter.category.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `category=${filter.category}`;
        }

        return queryParams;
    }

    getAllStyles(): Observable<Style[]> {
        return this.http.get<{ data: Style[] }>(this.apiEndpoint)
            .pipe(map(response => {
                response.data.sort(function (a, b) {
                    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
                });
                return response.data;
            }));
    }

}

