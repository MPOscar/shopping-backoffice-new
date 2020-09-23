import { Injectable } from '@angular/core';
//
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TouchDetectorService {
  
    public isTouched$: BehaviorSubject<boolean>;

    public isTouched: boolean = false;
    
    constructor() {
        this.isTouched$ = new BehaviorSubject<boolean>(false);
    }

    public setIsTouched(value: boolean) {
        this.isTouched = value;
        this.isTouched$.next(value);
    }

}
