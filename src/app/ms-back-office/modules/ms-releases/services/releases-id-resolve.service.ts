import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
//
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../error-handling/services/error-handling.service';
import { ReleaseService } from './releases.service';

const errorKey = 'Error';

@Injectable({
    providedIn: 'root'
})
export class ReleaseIdResolveService implements Resolve<any> {
    constructor(
        private releaseService: ReleaseService,
        private translate: TranslateService,
        private errorHandlingService: ErrorHandlingService) {
        //setTranslations(this.translate, TRANSLATIONS);
    }

    resolve(route: ActivatedRouteSnapshot) {
        let releaseId: string = route.queryParams['id'];
        if (releaseId) {
            return this.releaseService.getRelease(releaseId).pipe(
                map(response => response.data),
                catchError((err) => {
                    this.errorHandlingService.handleUiError(errorKey, err);
                    return of(null);
                }));
        } else {
            return {
                name: '',
                description: '',
                sku: '',
                styleId: '',
                hot: false,
                customized: false
            };
        }
    }
}
