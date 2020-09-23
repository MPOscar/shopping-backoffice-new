import { ActivatedRoute, NavigationCancel, NavigationExtras, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
//
import { BehaviorSubject, empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
//
import { ConfigService } from '../../config/services/config.service';
import { ErrorHandlingService } from '../../error-handling/services/error-handling.service';
import { ErrorHandlingHttpService } from '../../error-handling/services/error-handling-http.service';
import { LoginUser } from '../models/login-user';
//import { LocaleService, setTranslations } from '@c/ngx-translate';
//import { RootActionsService } from '../../ngrx/services/root-actions.service';
import { TRANSLATIONS } from './i18n/auth-service.translations';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loginCommands: any[];
    loginNavigationExtras?: NavigationExtras;
    redirectCommands: any[];
    redirectNavigationExtras?: NavigationExtras;
    afterLoginCommands: any[];
    afterLoginNavigationExtras?: NavigationExtras;
    changePasswordCommands: any[];
    changePasswordNavigationExtras: NavigationExtras;
    private userSource = new BehaviorSubject<any>({});
    public userData = this.userSource.asObservable();
    public userPreferences: any;
    public userFullName$ = new BehaviorSubject<string>(null);
    public twoFactorAuthModalData$ = new BehaviorSubject<any>(null);
    public twoFactorAuthModalNavigation$ = new BehaviorSubject<string>(null);

    constructor(private http: ErrorHandlingHttpService,
        private errorHandlingService: ErrorHandlingService,
        private router: Router,
        private configService: ConfigService,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        //private localService: LocaleService,
        //private rootActions: RootActionsService
    ) {
        //setTranslations(this.translate, TRANSLATIONS);
        /*this.localService.getCurrentValue().subscribe(lang => {
            this.currentLang = lang;
        });*/
    }

    get logoutCommands(): any[] {
        return this.errorHandlingService.logoutCommands;
    }

    set logoutCommands(value: any[]) {
        this.errorHandlingService.logoutCommands = value;
    }

    get logoutNavigationExtras(): NavigationExtras {
        return this.errorHandlingService.logoutNavigationExtras;
    }

    set logoutNavigationExtras(value: NavigationExtras) {
        this.errorHandlingService.logoutNavigationExtras = value;
    }

    getHeaders(addUserOauth = false, isForm = false, addAuthorization = true): HttpHeaders {
        let requestOptions = new HttpHeaders({
            'Accept-Language': this.currentLang,
            'Content-Type': isForm ? 'application/x-www-form-urlencoded' : 'application/json',
        });


        if (addAuthorization) {
            requestOptions = requestOptions.append('Authorization', 'Bearer ' + this.userToken);
        }

        if (addUserOauth) {
            requestOptions = requestOptions.append('useroauth', this.userToken);
        }
        return requestOptions;
    }

    get userToken(): string {
        return this.http.userToken;
    }

    set userToken(value: string) {
        this.http.userToken = value;
    }

    get currentLang(): string {
        return this.http.currentLanguage;
    }

    set currentLang(value: string) {
        this.http.currentLanguage = value;
    }

    get currentUser(): any {
        const localStorageUser = localStorage.getItem('currentUser');
        if (localStorageUser && localStorageUser !== 'null') {
            return JSON.parse(localStorageUser);
        }
        return null;
    }


    get isAuthenticated(): boolean {
        return this.userToken && this.userToken !== 'null' ? true : false;
    }

    set currentUser(value: any) {
        localStorage.setItem('currentUser', value ? JSON.stringify(value) : null);
        this.userFullName$.next(this.loggedUserInfo());
    }

    loggedUserInfo() {
        const value = this.currentUser;
        let userFullname = null;

        if (value) {
            userFullname = value.first_name && value.last_name ? `${value.first_name} ${value.last_name}` : null;
            if (!userFullname) {
                userFullname = value.first_name ? value.first_name : value.last_name;
                userFullname = userFullname ? userFullname : value.username;
            }
        }
        return userFullname;
    }

    loginUser(email: string, password: string, code?: string): Observable<any> {
        // TEMPORARY HACK. SEE https://github.com/angular/angular/issues/18261
        password = password.replace("+", "%2B");
        //

        let headers = this.getHeaders(false, false, false);
        let credentials = {
            "email": email,
            "password": password
        };
        return this.http.post<LoginUser>(this.configService.apiUrl + this.configService.config.apiConfigs.authentication.loginUser.apiEndpoint,
            credentials, { headers: headers }).pipe(map((response: LoginUser) => {
                let token = response.data.access_token;
                if (!token || token.length === 0) {
                    throw new Error();
                }
                this.userToken = token;
                //const { user } = response; TODO
                if (response) {
                    //this.currentUser = user;
                    this.userToken = token;
                    this.userPreferences = response.preferences && response.preferences.length ?
                        JSON.parse(response.preferences) : {};
                } else {
                    this.currentUser = null;
                    throw new Error();
                }
                return empty();
            }))
    }

    logout(): void {
        /*let headers = this.getHeaders(false, true, false);
        let credentials = 'grant_type=password'
            + '&token=' + this.userToken;
        // Using the builtin Http of angular for prevent handling the errors and showing messages to the user
        this.http.httpClient.post(this.configService.config.apiConfigs.authentication.revokeUser.apiEndpoint,
            credentials, { headers: headers }).subscribe();*/
        this.logoutSpa();
    }

    postUserPreferences(preferences: string): Observable<any> {
        let headers = this.getHeaders(true);
        return this.http.post(this.configService.config.apiConfigs.authentication.userPreferences.apiEndpoint,
            preferences);
    }

    getUserPreferences(): Observable<any> {
        let headers = this.getHeaders(true);
        return this.http.get<any>(this.configService.config.apiConfigs.authentication.userPreferences.apiEndpoint,
            { headers: headers })
            .pipe(map((response) => {
                this.userPreferences = JSON.parse(response.preferences);
                //this.rootActions.setState(this.userPreferences);TODO
                return this.userPreferences;
            }));
    }

    logoutSpa(): Observable<{}> {
        this.userToken = null;
        this.currentUser = null;
        return empty();
    }

    updateExpirationTime(data): Observable<any> {
        return this.http.patch(this.configService.config.apiConfigs.authentication.tokenExpirationTime.apiEndpoint, data, { headers: this.getHeaders(true) });
    }

    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.http.patch<any>(this.configService.config.apiConfigs.authentication.changePassword.apiEndpoint, {
            old_password: currentPassword,
            new_password: newPassword
        }, { headers: this.getHeaders() })
    }

    patchUser(data: any, userId: string): Observable<any> {
        return this.http.patch<any>(this.configService.config.apiConfigs.users.apiEndpoint + userId + '/', JSON.stringify(data));
    }

    passUserData(user: any) {
        this.userSource.next(user);
    }

}
