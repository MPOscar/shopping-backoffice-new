import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class SocialNetworksService {

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


    putSocialNetworks(socialNetwork: string, data: any): Observable<any> {
        return this.http.put<any>(this.apiEndpoint + socialNetwork +'/', JSON.stringify(data));
    }

    getSocialNetworks(socialNetwork: string): Observable<any> {
        return this.http.get<any>(this.apiEndpoint + socialNetwork +'/');
    }

}

