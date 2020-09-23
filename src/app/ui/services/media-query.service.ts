import { Injectable } from '@angular/core';
//
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MediaQueryService {
  
    public isXs$: BehaviorSubject<boolean>;

    public isSm$: BehaviorSubject<boolean>;

    public isMd$: BehaviorSubject<boolean>;

    public isLg$: BehaviorSubject<boolean>;

    public isXs: boolean = false;

    public isSm: boolean = false;

    public isMd: boolean = false;

    public isLg: boolean = false;
    
    constructor() {
        this.isXs$ = new BehaviorSubject<boolean>(false);
        this.isSm$ = new BehaviorSubject<boolean>(false);
        this.isMd$ = new BehaviorSubject<boolean>(false);
        this.isLg$ = new BehaviorSubject<boolean>(false);
    }

    public setXs(value: boolean) {
        this.isXs = value;
        this.isXs$.next(value);
    }

    public setSm(value: boolean) {
        this.isSm = value;
        this.isSm$.next(value);
    }

    public setMd(value: boolean) {
        this.isMd = value;
        this.isMd$.next(value);
    }

    public setLg(value: boolean) {
        this.isLg = value;
        this.isLg$.next(value);
    }

}
