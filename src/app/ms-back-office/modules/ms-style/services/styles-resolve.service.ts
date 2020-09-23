import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
//
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../error-handling/services/error-handling.service';
import { StylesService } from './styles.service';
//import { setTranslationsstyles.service

const errorKey = 'Error';

@Injectable({
    providedIn: 'root'
})
export class StylesResolveService implements Resolve<any> {
    constructor(
        private stylesService: StylesService,
        private translate: TranslateService,
        private errorHandlingService: ErrorHandlingService) {
        //setTranslations(this.translate, TRANSLATIONS);
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.stylesService.getAllStyles().pipe(
            map(brands => brands),
            catchError((err) => {
                this.errorHandlingService.handleUiError(errorKey, err);
                return of(null);
            }));
    }
}
