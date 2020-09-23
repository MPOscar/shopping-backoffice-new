import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Collection, CollectionsListResponse, CollectionResponse } from '../models/collection';
import { SelectedShop } from '../../ms-shops/models/selected-shop';

export const ASCENDING = 'asc';

@Injectable({
    providedIn: 'root'
})
export class CollectionsService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'name';

    previousSortDirection: string = 'asc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public collectionsList = new BehaviorSubject<CollectionsListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
        this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.collections.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getCollections(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<CollectionsListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<CollectionsListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a brand for example.
    //

    reloadCollections(): Observable<CollectionsListResponse> {
        return this.getCollections(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postCollection(data: Collection): Observable<Collection> {
        return this.http.post<Collection>(this.apiEndpoint, JSON.stringify(data));
    }
        
    getCollection(id: string): Observable<CollectionResponse> {
        return this.http.get<CollectionResponse>(this.apiEndpoint + id + '/');
    }

    postCollectionLinkedShops(id: string, data: Array<SelectedShop>): Observable<Collection> {
        return this.http.post<Collection>(this.apiEndpoint + id + '/shops/', JSON.stringify(data));
    }

    getCollectionLinkedShops(id: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + id + '/shops/');
    }

    postCollectionLinkedOffers(id: string, data: Array<string>): Observable<Collection> {
        return this.http.post<Collection>(this.apiEndpoint + id + '/offers/', JSON.stringify(data));
    }

    getCollectionLinkedOffers(id: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + id + '/offers/');
    }

    putCollection(data: Collection): Observable<Collection> {
        return this.http.put<Collection>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteCollection(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
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

        if (filter.name && filter.name.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `name=${filter.name}`;
        }

        if (filter.brand && filter.brand.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `brand=${filter.brand}`;
        }

        return queryParams;
    }

    //
    // End functions that most services have.
    //

    //
    // Begin special functions specific to only this service.
    //

    getAllCollections(): Observable<Collection[]> {
        return this.http.get<{ data: Collection[] }>(this.apiEndpoint + '?ordering=-updatedAt')
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

