import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Privacy, PrivacyResponse } from '../models/privacy';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class GDPRService {

    apiEndpoint: string;

    previousFilter: any = {};

    previousSortColumn: string = 'title';

    previousSortDirection: string = 'asc';

    previousPageIndex: number = 0;

    previousPageSize: number = 10;

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.settings.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //


    putGDPR(data: Privacy): Observable<Privacy> {
        return this.http.put<Privacy>(this.apiEndpoint + 'gdpr/', JSON.stringify(data));
    }

    getGDPR(): Observable<PrivacyResponse> {
        return this.http.get<PrivacyResponse>(this.apiEndpoint + 'gdpr/');
    }

}

