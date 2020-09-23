import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

    apiEndpoint: string;

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.analythics.apiEndpoint;
    }

    getNumberOfClicks(eventType: string): Observable<any> {
        let queryParams = '?eventName=' + eventType;
        return this.http.get<any>(this.apiEndpoint + queryParams);
    }
}

