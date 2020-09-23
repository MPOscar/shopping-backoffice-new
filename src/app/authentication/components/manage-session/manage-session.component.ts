import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'manage-session',
    template: ``
})
export class ManageSessionComponent implements OnInit {

    constructor(private authService: AuthService) {
    }

    manageSession(addOrRemoveCounter: boolean): boolean {
        const sessionCounterString = localStorage.getItem('tabCount');
        let sessionCounterActual = sessionCounterString !== undefined && sessionCounterString ? parseInt(localStorage.getItem('tabCount')) : 0;
        if (addOrRemoveCounter) {
            localStorage.setItem('tabCount', (sessionCounterActual + 1).toString());
        } else {
            sessionCounterActual = (sessionCounterActual - 1) >= 0 ? (sessionCounterActual - 1) : 0;
            localStorage.setItem('tabCount', sessionCounterActual.toString());
            if (sessionCounterActual === 0) {
                return this.updateExpirationTime();
            }
        }
        return true
    }

    sleep(milliseconds) {
        let start = new Date().getTime();
        for (let i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler($event: any) {
        this.manageSession(false);
        return true;
    }

    updateExpirationTime(): boolean {
        if (this.authService.currentUser) {
            this.authService.updateExpirationTime({userActive: 0}).subscribe(() => {
            });
            this.sleep(300);
            return false;
        }
        return true;
    }

    ngOnInit() {
        this.manageSession(true);
    }

}
