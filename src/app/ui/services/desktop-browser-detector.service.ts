import { Injectable } from '@angular/core';
//
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DesktopBrowserDetectorService {
  
    public isDesktopBrowser$: BehaviorSubject<boolean>;

    public isDesktopBrowser: boolean = false;
    
    constructor() {
        this.isDesktopBrowser$ = new BehaviorSubject<boolean>(false);
    }

    public setIsDesktopBrowser(value: boolean) {
        this.isDesktopBrowser = value;
        this.isDesktopBrowser$.next(value);
    }

}
