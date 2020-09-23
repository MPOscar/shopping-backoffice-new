import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Offer, OffersListResponse, OfferResponse } from '../models/offer';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'updatedAt';

    previousSortDirection: string = 'desc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public offersList = new BehaviorSubject<OffersListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.offers.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getOffers(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<OffersListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<OffersListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a Offer for example.
    //

    reloadOffers(): Observable<OffersListResponse> {
        return this.getOffers(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postOffer(data: Offer): Observable<Offer> {
        return this.http.post<Offer>(this.apiEndpoint, JSON.stringify(data));
    }

    postOffers(data: Offer[]): Observable<Offer[]> {
        return this.http.post<Offer[]>(this.apiEndpoint, JSON.stringify(data));
    }

    getOffer(id: string): Observable<OfferResponse> {
        return this.http.get<OfferResponse>(this.apiEndpoint + id + '/');
    }

    putOffer(data: Offer): Observable<Offer> {
        return this.http.put<Offer>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteOffer(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

        if (filter.collectionId && filter.collectionId.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `collectionId=${filter.collectionId}`;
        }

        if (filter.shopId && filter.shopId.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `shopId=${filter.shopId}`;
        }

        if (filter.sku && filter.sku.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `sku=${filter.sku}`;
        }

        if (filter.status && filter.status.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `status=${filter.status}`;
        }

        if (filter.releaseId && filter.releaseId.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `releaseId=${filter.releaseId}`;
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

    getAllOffers(): Observable<Offer[]> {
        return this.http.get<{ data: Offer[] }>(this.apiEndpoint)
            .pipe(map(response => {
                response.data.sort(function (a, b) {
                    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
                });
                return response.data;
            }));
    }

    getAllOffersBy(query: string): Observable<Offer[]> {
        return this.http.get<{ data: Offer[] }>(this.apiEndpoint + query)
            .pipe(map(response => {
                return response.data;
            }));
    }    

    //
    // End special functions specific to only this service.
    //

}

