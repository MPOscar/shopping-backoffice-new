import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
//
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
    selector: 'layout-slider-topnav',
    templateUrl: './layout-slider-topnav.component.html',
    styleUrls: ['./layout-slider-topnav.component.scss']
})
export class LayoutSliderTopnavComponent implements OnInit {
    pushRightClass: string = 'push-right';

    constructor(
        public authService: AuthService,
        public router: Router,
        private translate: TranslateService) {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() { }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
        this.router.navigate(['/login']);
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
