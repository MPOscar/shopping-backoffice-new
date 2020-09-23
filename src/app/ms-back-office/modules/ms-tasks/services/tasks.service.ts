import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Task, TasksListResponse, TasksResponse } from '../models/tasks';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'description';

    previousSortDirection: string = 'asc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    public tasksList = new BehaviorSubject<TasksListResponse>({ dataCount: 0, data: [] });

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.tasks.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    getTasks(filter: any, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<TasksListResponse> {
        this.previousFilter = filter;
        this.previousSortColumn = sortColumn;
        this.previousSortDirection = sortDirection;
        this.previousPageIndex = pageIndex;
        this.previousPageSize = pageSize;

        let queryParams = this.formatQueryParams(
            filter,
            sortColumn, sortDirection,
            pageIndex, pageSize);

        return this.http.get<TasksListResponse>(this.apiEndpoint + queryParams);
    }

    //
    // Call this function to repeat the previous query, after deleting
    // a Task for example.
    //

    reloadTasks(): Observable<TasksListResponse> {
        return this.getTasks(
            this.previousFilter,
            this.previousSortColumn, this.previousSortDirection,
            this.previousPageIndex, this.previousPageSize);
    }

    postTask(data: Task): Observable<Task> {
        return this.http.post<Task>(this.apiEndpoint, JSON.stringify(data));
    }

    getTask(id: string): Observable<TasksResponse> {
        return this.http.get<TasksResponse>(this.apiEndpoint + id + '/');
    }

    putTask(data: Task): Observable<Task> {
        return this.http.put<Task>(this.apiEndpoint + data.id + '/', JSON.stringify(data));
    }

    deleteTask(id: string): Observable<any> {
        return this.http.delete<any>(this.apiEndpoint + id + '/');
    }

    formatQueryParams(filter?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
        let queryParams = '';

        if (filter.description && filter.description.length > 0) {
            queryParams += queryParams.length > 0 ? '&' : '?';
            queryParams += `description=${filter.description}`;
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

    getAllTasks(): Observable<Task[]> {
        return this.http.get<{ data: Task[] }>(this.apiEndpoint)
            .pipe(map(response => {
                response.data.sort(function (a, b) {
                    return ((a.task < b.task) ? -1 : ((a.task > b.task) ? 1 : 0));
                });
                return response.data;
            }));
    }

    //
    // End special functions specific to only this service.
    //

}

