import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
//
import { Observable, of, empty } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
//
import { AuthService } from './auth.service';
import { ErrorHandlingService } from '../../error-handling/services/error-handling.service';
//import { setTranslations } from '@c/ngx-translate';
import { TranslateService } from '@ngx-translate/core';
import { TRANSLATIONS } from './i18n/user-preferences-resolve.service.translations';

@Injectable({
    providedIn: 'root'
})
export class UserPreferencesResolveService implements Resolve<any> {
    constructor(
        private authService: AuthService,
        private translate: TranslateService,
        private errorhandlingService: ErrorHandlingService) {
        //setTranslations(this.translate, TRANSLATIONS);
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        if (this.authService.userPreferences) {
            return of(this.authService.userPreferences);
        }
        return this.authService.getUserPreferences().pipe(tap(),
            catchError(err => {
                this.errorhandlingService.handleUiError('@c/authentication/UserPreferencesResolveService/Error', err);
                return empty(null);
            }));
    }
}
