import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Deal } from '../models/deal';
import { DealsListResponse, DealResponse } from '../models/deal';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class DealsService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'updatedAt';

    previousSortDirection: string = 'desc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public dealsList = new BehaviorSubject<DealsListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.deals.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getDeals(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<DealsListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<DealsListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a Deal for example.
    //

    reloadDeals(): Observable<DealsListResponse> {
        return this.getDeals(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postDeal(data: Deal): Observable<Deal> {
        return this.http.post<Deal>(this.apiEndpoint, JSON.stringify(data));
    }

    getDeal(id: string): Observable<DealResponse> {
        return this.http.get<DealResponse>(this.apiEndpoint + id + '/');
    }

    putDeal(data: Deal): Observable<Deal> {
        return this.http.put<Deal>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteDeal(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

        if (filter.url && filter.url.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `url=${filter.url}`;
        }

        if (filter.shopId && filter.shopId.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `shopId=${filter.shopId}`;
        }

        /*if (filter.collection && filter.collection.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `collection=${filter.collection}`;
        }*/

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

    getAllDeals(): Observable<Deal[]> {
        return this.http.get<{ data: Deal[] }>(this.apiEndpoint)
            .pipe(map(response => {
                return response.data;
            }));
    }

    getAllDealsBy(query: string): Observable<Deal[]> {
        return this.http.get<{ data: Deal[] }>(this.apiEndpoint + query)
            .pipe(map(response => {
                return response.data;
            }));
    }

    //
    // End special functions specific to only this service.
    //

}

