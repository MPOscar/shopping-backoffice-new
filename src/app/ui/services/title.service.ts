import { Injectable } from '@angular/core';
//
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  
  public title: BehaviorSubject<string>;

  constructor() {
    this.title = new BehaviorSubject<string>(undefined);
  }

  public setTitle(value: string) {
      this.title.next(value);
  }
}
