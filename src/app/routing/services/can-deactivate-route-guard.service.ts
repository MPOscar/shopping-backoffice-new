import { Injectable } from '@angular/core';
import { CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../authentication/services/auth.service';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateRouteGuard implements CanDeactivate<CanComponentDeactivate> {

    constructor(private authService: AuthService) {}

    canDeactivate(component: CanComponentDeactivate,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
        nextState?: RouterStateSnapshot) {
        if (nextState.url.lastIndexOf(this.authService.logoutCommands.toString()) >= 0 && !nextState.root.queryParams.user_logout) {
            return of(true);
        } else {
            return component.canDeactivate ? component.canDeactivate() : true;
        }
    }

}
