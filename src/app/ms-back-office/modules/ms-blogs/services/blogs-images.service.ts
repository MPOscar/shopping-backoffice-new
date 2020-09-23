import { Injectable } from '@angular/core';
//
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Release, ReleasesImagesListResponse, ReleaseResponse, ReleaseImage, ReleaseImagesResponse, MainImage } from '../../ms-releases/models/releases';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';

export const ASCENDING = 'asc';

@Injectable({
    providedIn: 'root'
})
export class BlogsImgesService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'name';

    previousSortDirection: string = 'asc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
        this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.blogs.apiEndpoint;
    }

    getBlogImages(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<ReleasesImagesListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);
        return this.http.get<ReleasesImagesListResponse>(this.apiEndpoint + queryParams);
    }

    reloadReleasesImages(): Observable<ReleasesImagesListResponse> {
        return this.getBlogImages(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postBlogImage(id: string, data: ReleaseImage): Observable<ReleaseImage> {
        return this.http.post<ReleaseImage>(this.apiEndpoint + id + '/images/', JSON.stringify(data));
    }

    patchReleaseMainImage(id: string, data: MainImage): Observable<any> {
        return this.http.patch<any>(this.apiEndpoint + id + '/mainImage/', JSON.stringify(data));
    }

    postReleaseImageAll(id: string, data: ReleaseImage[]): Observable<ReleaseImage> {
        return this.http.post<ReleaseImage>(this.apiEndpoint + id + '/images/', JSON.stringify(data));
    }

    getBlogImage(id: string): Observable<ReleaseImagesResponse> {
        return this.http.get<ReleaseImagesResponse>(this.apiEndpoint + id + '/');
    }

    getBlogAllImages(id: string): Observable<ReleaseImagesResponse> {
        return this.http.get<ReleaseImagesResponse>(this.apiEndpoint + id + '/images/');
    }

    patchBlogImage(data: ReleaseImage): Observable<ReleaseImage> {
        return this.http.patch<ReleaseImage>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteBlogImage(id: string, idImage: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/images/' + idImage + '/');
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

    getAllReleasesImages(): Observable<Release[]> {
        return this.http.get<{ data: Release[] }>(this.apiEndpoint)
            .pipe(map(response => {
                return response.data;
            }));
    }

}

