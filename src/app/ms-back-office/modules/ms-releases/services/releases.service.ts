import { Injectable } from '@angular/core';
//
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Release, ReleasesListResponse, ReleaseResponse } from '../models/releases';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
import { HttpParams } from '@angular/common/http';

export const ASCENDING = 'asc';

import * as _ from 'lodash'

@Injectable({
    providedIn: 'root'
})
export class ReleaseService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'updatedAt';

    previousSortDirection: string = 'desc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public releasesList = new BehaviorSubject<ReleasesListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
        this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.releases.apiEndpoint;
    }

    getReleases(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<ReleasesListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        const queryParams = this.getHttpParams({
            ...filter,
            ordering: sortDirection === 'desc' ? `-${sortColumn}` : sortColumn,
            offset: pageIndex, 
            limit: pageSize
        });
        return this.http.get<ReleasesListResponse>(this.apiEndpoint, { params: queryParams });
    }

    reloadReleases(): Observable<ReleasesListResponse> {
        return this.getReleases(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postRelease(data: Release): Observable<ReleaseResponse> {
        return this.http.post<ReleaseResponse>(this.apiEndpoint, JSON.stringify(data));
    }

    getRelease(id: string): Observable<ReleaseResponse> {
        return this.http.get<ReleaseResponse>(this.apiEndpoint + id + '/');
    }

    patchHideRelease(id: string): Observable<ReleaseResponse> {
        return this.http.patch<ReleaseResponse>(this.apiEndpoint + id + '/hiddenDashboard', {});
    }

    putRelease(data: Release): Observable<Release> {
        return this.http.put<Release>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteRelease(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    /**
     * @param params
     * @returns {HttpParams}
     */
    private getHttpParams(params: any): HttpParams {
        let httpParams = new HttpParams();
        _.forOwn(params, (value, key) => {
            if (value !== undefined && value !== null && value !== '') {
                httpParams = httpParams.set(key, value);
            }
        });

        return httpParams;
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

        if (filter.brandId && filter.brandId.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `brandId=${filter.brandId}`;
        }

        if (filter.collectionId && filter.collectionId.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `collectionId=${filter.collectionId}`;
        }

        if (filter.category && filter.category.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `category=${filter.category}`;
        }
        
        if (filter.outdated) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `outdated=${filter.outdated}`;
        }

        if (filter.hiddenDashboard) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `hiddenDashboard=${filter.hiddenDashboard}`;
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

    getAllReleases(): Observable<Release[]> {
        return this.http.get<{ data: Release[] }>(this.apiEndpoint)
            .pipe(map(response => {
                response.data.sort(function (a, b) {
                    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
                });
                return response.data;
            }));
    }

}

