import { Injectable } from '@angular/core';
//
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Shop, ShopsImagesListResponse, ShopsResponse, ShopImagesResponse } from '../models/shops';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
import { Face, MainImage } from '../../../../ui/modules/images-card/models/face';

export const ASCENDING = 'asc';

@Injectable({
    providedIn: 'root'
})
export class ShopsImgesService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'name';

    previousSortDirection: string = 'asc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public shopsImagesList = new BehaviorSubject<ShopsImagesListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
        this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.shops.apiEndpoint;
    }

    getShopImages(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<ShopsImagesListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);
        return this.http.get<ShopsImagesListResponse>(this.apiEndpoint + queryParams);
    }

    reloadShopImages(): Observable<ShopsImagesListResponse> {
        return this.getShopImages(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }


    getShopImage(id: string): Observable<ShopImagesResponse> {
        return this.http.get<ShopImagesResponse>(this.apiEndpoint + id + '/');
    }

    patchShopImage(data: Face): Observable<any> {
        return this.http.patch<any>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

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

}

