import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[capsLock]'
})
export class CapsLockDirective {

    capsLockEnabled: boolean = false;

    @Output('capsLock') capsLock = new EventEmitter<Object>();

    @HostListener('window:keydown', ['$event'])
        onKeyDown(event: KeyboardEvent): void {
            if (event.which == 20 && this.capsLockEnabled !== null) {
                this.capsLockEnabled = !this.capsLockEnabled;
                // console.log("Keydown. CapsLock enabled: " + this.capsLockEnabled.toString());
                this.capsLock.emit(this.capsLockEnabled);
              } else if (event.which == 20) {
                // console.log("Keydown. Initial state not set.");
              }
            
    }

    @HostListener('window:keypress', ['$event'])
        onKeyPress(event: KeyboardEvent): void {
            var str = String.fromCharCode(event.which);
            if (!str || str.toLowerCase() === str.toUpperCase()) {
                // console.log("Keypress. Some control key pressed.");
                return;
            }
            this.capsLockEnabled = (str.toLowerCase() === str && event.shiftKey) || (str.toUpperCase() === str && !event.shiftKey);
            // console.log("Keypress. CapsLock enabled: " + this.capsLockEnabled.toString());
            this.capsLock.emit(this.capsLockEnabled);
            
    }
}
