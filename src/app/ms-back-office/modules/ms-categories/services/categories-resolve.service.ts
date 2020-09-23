import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
//
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../error-handling/services/error-handling.service';
import { CategoriesService } from './categories.service';
//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

@Injectable({
    providedIn: 'root'
})
export class CategoriesResolveService implements Resolve<any> {
    constructor(
        private categoriesService: CategoriesService,
        private translate: TranslateService,
        private errorHandlingService: ErrorHandlingService) {
        //setTranslations(this.translate, TRANSLATIONS);
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.categoriesService.getAllCategories().pipe(
            map(brands => brands),
            catchError((err) => {
                this.errorHandlingService.handleUiError(errorKey, err);
                return of(null);
            }));
    }
}
