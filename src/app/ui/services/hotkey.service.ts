import { Injectable } from '@angular/core';
//
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotkeyService {

  public hotkey: Subject<number>;

  constructor() {
    this.hotkey = new Subject<number>();
  }

  onHotkeyPressed(hotkey: number) {
    this.hotkey.next(hotkey);
  }
}
