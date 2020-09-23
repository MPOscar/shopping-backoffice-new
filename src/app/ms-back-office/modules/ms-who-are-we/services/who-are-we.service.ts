import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { Observable } from 'rxjs';
//
import { ConfigService } from '../../../../config/services/config.service';
import { WhoAreWeResponse, WhoAreWe } from '../models/who-are-we';
export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class WhoAreWeService {

    apiEndpoint: string;

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.settings.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    postWhoAreWe (data: WhoAreWe): Observable<any> {
        return this.http.post<any>(this.apiEndpoint + 'who_are_we', JSON.stringify(data));
    }

    getWhoAreWe(): Observable<WhoAreWeResponse> {
        return this.http.get<WhoAreWeResponse>(this.apiEndpoint + 'who_are_we');
    }

    putWhoAreWe(data: WhoAreWe): Observable<WhoAreWeResponse> {
        return this.http.put<WhoAreWeResponse>(this.apiEndpoint + 'who_are_we', JSON.stringify(data));
    }

}

