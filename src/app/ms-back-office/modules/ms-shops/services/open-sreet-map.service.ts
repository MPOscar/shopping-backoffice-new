import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { ConfigService } from '../../../../config/services/config.service';
import { Shop, ShopsListResponse, ShopsResponse } from '../models/shops';

export const ASCENDING = 'asc';

const SEARCHAPIENDPOINT = 'https://nominatim.openstreetmap.org/search';

@Injectable({
    providedIn: 'root'
})
export class OpenStreetMapService {

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
    }

    getAddressPredictions(address: string): Observable<any> {
        return this.http.get<any>(SEARCHAPIENDPOINT + '?q=' + address + '&format=json');
    }

}

