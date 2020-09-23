import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
    selector: '[askBeforeRefresh]'
})
export class AskBeforeRefreshDirective implements OnInit, OnDestroy {

    @Input('askBeforeRefresh') isDirtyForm: boolean;

    constructor(el: ElementRef) {
    }

    ngOnInit() {
        window.addEventListener('beforeunload', this.askBeforeRefresh);
    }

    askBeforeRefresh = (event) => {
        const confirmationMessage = 'show';
        if (!this.isDirtyForm) {
            return true;
        }
        event.returnValue = confirmationMessage;
        return confirmationMessage;
    };

    ngOnDestroy() {
        window.removeEventListener('beforeunload', this.askBeforeRefresh);
    }
}
