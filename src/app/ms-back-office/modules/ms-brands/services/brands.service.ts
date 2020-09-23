import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Brand, LinkedShop } from '../models/brand';
import { BrandsListResponse, BrandResponse } from '../models/brand';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'updatedAt';

    previousSortDirection: string = 'desc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public brandsList = new BehaviorSubject<BrandsListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.brands.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getBrands(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<BrandsListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<BrandsListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a brand for example.
    //

    reloadBrands(): Observable<BrandsListResponse> {
        return this.getBrands(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postBrand(data: Brand): Observable<BrandResponse> {
        return this.http.post<BrandResponse>(this.apiEndpoint, JSON.stringify(data));
    }

    getBrand(id: string): Observable<BrandResponse> {
        return this.http.get<BrandResponse>(this.apiEndpoint + id + '/');
    }

    postBrandLinkedShops(id: string, data: Array<LinkedShop>): Observable<Brand> {
        return this.http.post<Brand>(this.apiEndpoint + id + '/shops/', JSON.stringify(data));
    }

    getBrandLinkedShops(id: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + id + '/shops/');
    }

    putBrand(data: Brand): Observable<Brand> {
        return this.http.put<Brand>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteBrand(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

        if (filter.name && filter.name.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `name=${filter.name}`;
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

    getAllBrands(): Observable<Brand[]> {
        return this.http.get<{ data: Brand[] }>(this.apiEndpoint)
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

