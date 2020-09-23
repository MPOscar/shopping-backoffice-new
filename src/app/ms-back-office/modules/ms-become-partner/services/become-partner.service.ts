import { Injectable } from '@angular/core';
import { ErrorHandlingHttpService } from '../../../../error-handling/services/error-handling-http.service';
//
import { Observable } from 'rxjs';
//
import { ConfigService } from '../../../../config/services/config.service';
import { BecomePartner, BecomePartnerResponse } from '../models/become-partner';

export const ASCENDING = 'asc';

@Injectable({
  providedIn: 'root'
})
export class BecomePartnerService {

    apiEndpoint: string;

    constructor(
        private configService: ConfigService,
        private http: ErrorHandlingHttpService) {
            this.apiEndpoint = this.configService.apiUrl + this.configService.config.apiConfigs.settings.apiEndpoint;
    }

    //
    // Begin functions that most services have.
    //

    postBecomePartner (data: BecomePartner): Observable<any> {
        return this.http.post<any>(this.apiEndpoint, JSON.stringify(data));
    }

    getBecomePartner(): Observable<BecomePartnerResponse> {
        return this.http.get<BecomePartnerResponse>(this.apiEndpoint + 'become_partner');
    }

    putBecomePartner(data: BecomePartner): Observable<BecomePartnerResponse> {
        return this.http.put<BecomePartnerResponse>(this.apiEndpoint + 'become_partner', JSON.stringify(data));
    }

}

