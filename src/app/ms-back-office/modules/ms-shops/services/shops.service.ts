import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Shop, ShopsListResponse, ShopsResponse } from '../models/shops';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn = 'updatedAt';

    previousSortDirection = 'desc';

    previousPageIndex = 0;

    previousPageSize = 10;

    public shopsList = new BehaviorSubject<ShopsListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.shops.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getShops(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<ShopsListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        const queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<ShopsListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a brand for example.
    //

    reloadShops(): Observable<ShopsListResponse> {
        return this.getShops(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postShop(data: Shop): Observable<ShopsResponse> {
        return this.http.post<ShopsResponse>(this.apiEndpoint, JSON.stringify(data));
    }

    getShop(id: string): Observable<ShopsResponse> {
        return this.http.get<ShopsResponse>(this.apiEndpoint + id + '/');
    }

    getShopCountries(): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + 'countries/');
    }

    postShopLinkedSubShops(id: string, data: Array<string>): Observable<Shop> {
        return this.http.post<Shop>(this.apiEndpoint + id + '/shops/', JSON.stringify(data));
    }

    getShopLinkedSubShops(id: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + id + '/shops/');
    }

    putShop(data: Shop): Observable<Shop> {
        return this.http.put<Shop>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteShop(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }



    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

        if (filter.name && filter.name.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `name=${filter.name}`;
        }

        if (filter.status && filter.status.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `active=${filter.status}`;
        }

        if (filter.isParent === 0 || filter.isParent === 1) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `isParent=${filter.isParent}`;
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

    getAllShops(): Observable<Shop[]> {
        return this.http.get<{ data: Shop[] }>(this.apiEndpoint  + '?ordering=name')
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

