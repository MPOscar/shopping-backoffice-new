import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
//
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../error-handling/services/error-handling.service';
import { ReleaseImagesService } from './releases-images.service';
//import { setTranslationsstyles.service

const errorKey = 'Error';

@Injectable({
    providedIn: 'root'
})
export class ReleaseAllImagesResolveService implements Resolve<any> {
    constructor(
        private releaseImagesService: ReleaseImagesService,
        private translate: TranslateService,
        private errorHandlingService: ErrorHandlingService) {
        //setTranslations(this.translate, TRANSLATIONS);
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        return this.releaseImagesService.getReleaseAllImages(route.paramMap.get('id')).pipe(
            map(brands => brands.data),
            catchError((err) => {
                this.errorHandlingService.handleUiError(errorKey, err);
                return of(null);
            }));
        ;
    }

}
