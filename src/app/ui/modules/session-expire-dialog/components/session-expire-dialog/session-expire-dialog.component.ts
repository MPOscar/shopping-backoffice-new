import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//import { setTranslations } from '@c/ngx-translate';
import { TRANSLATIONS } from './i18n/session-expire-dialog.component.translations'
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'session-expire-dialog',
    templateUrl: './session-expire-dialog.component.html'
})

export class SessionExpireDialogComponent implements OnInit, OnDestroy {

    remainingTime = 60;
    messageParam: any = {};
    sessionExpired = false;
    private _countDown$: Subscription;

    constructor(private translate: TranslateService,
        public dialogRef: MatDialogRef<SessionExpireDialogComponent>) {
        //setTranslations(this.translate, TRANSLATIONS);
    }

    ngOnInit() {
        this._countDown$ = timer(0, 1000).subscribe(() => {
            this.remainingTime -= 1;
            this.messageParam = { param: this.remainingTime };
            if (this.remainingTime <= 0) {
                this.logOutNow();
            }
        })
    }

    stayLoggedIn() {
        this.sessionExpired = false;
        this.dialogRef.close(true);
    }

    logOutNow() {
        this.sessionExpired = true;
        this.hide();
    }

    hide() {
        if (this._countDown$) {
            this._countDown$.unsubscribe();
        }
        this.dialogRef.close(false);
    }

    ngOnDestroy(): void {
        if (this._countDown$) {
            this._countDown$.unsubscribe();
        }
    }
}
