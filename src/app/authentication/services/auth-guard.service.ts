import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//
import { AuthService } from './auth.service';
import { ToastrService } from '../../error-handling/services/toastr.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad {

    constructor(private authService: AuthService,
                private toastr: ToastrService,
                private location: Location,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAuthenticated) {
            return true;
        }

        this.authService.loginNavigationExtras = {queryParams: {returnUrl: this.location.path()}};
        this.router.navigate(this.authService.logoutCommands);
        return false;
    }

    canLoad() {
        if (this.authService.isAuthenticated) {
            return true;
        }

        this.authService.loginNavigationExtras = {queryParams: {returnUrl: this.location.path()}};

        this.router.navigate(this.authService.logoutCommands);

        return false;
    }
}
