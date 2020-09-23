import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
//
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../error-handling/services/error-handling.service';
import { UsersService } from './users.service';
//import { setTranslations } from 'ngx-translate';TODO

const errorKey = 'Error';

@Injectable({
    providedIn: 'root'
})
export class UsersResolveService implements Resolve<any> {
    constructor(
        private usersService: UsersService,
        //private translate: TranslateService,TODO
        private errorHandlingService: ErrorHandlingService) {
        //setTranslations(this.translate, TRANSLATIONS);TODO
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.usersService.getAllUsers().pipe(
            map(brands => brands),
            catchError((err) => {
                this.errorHandlingService.handleUiError(errorKey, err);
                return of(null);
            }));
    }
}
