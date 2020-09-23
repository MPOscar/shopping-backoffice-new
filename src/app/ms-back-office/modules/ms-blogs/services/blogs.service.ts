import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Blog, BlogsListResponse, BlogsResponse } from '../models/blog';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'updatedAt';

    previousSortDirection: string = 'desc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public blogsList = new BehaviorSubject<BlogsListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.blogs.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getBlogs(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<BlogsListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<BlogsListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a Blog for example.
    //

    reloadBlogs(): Observable<BlogsListResponse> {
        return this.getBlogs(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postBlog(data: Blog): Observable<any> {
        return this.http.post<any>(this.apiEndpoint, JSON.stringify(data));
    }

    getBlog(id: string): Observable<BlogsResponse> {
        return this.http.get<BlogsResponse>(this.apiEndpoint + id + '/');
    }

    putBlog(data: Blog): Observable<Blog> {
        return this.http.put<Blog>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteBlog(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

        if (filter.title && filter.title.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `title=${filter.title}`;
        }

        if (filter.author && filter.author.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `author=${filter.author}`;
        }

        if (filter.type && filter.type.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `type=${filter.type}`;
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

    getAllBlogs(): Observable<Blog[]> {
        return this.http.get<{ data: Blog[] }>(this.apiEndpoint)
            .pipe(map(response => {
                response.data.sort(function (a, b) {
                    return ((a.title < b.title) ? -1 : ((a.title > b.title) ? 1 : 0));
                });
                return response.data;
            }));
    }

    //
    // End special functions specific to only this service.
    //

}

