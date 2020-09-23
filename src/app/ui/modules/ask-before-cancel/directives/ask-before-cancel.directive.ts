import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({
    selector: '[askBeforeCancel]'
})
export class AskBeforeCancelDirective {
    @Input() form: NgForm;
    @Input() message;
    @Output() answer: EventEmitter<boolean> = new EventEmitter();

    constructor(el: ElementRef) {

    }

    @HostListener('click') onMouseEnter() {
        if (this.form && this.form.dirty) {
            this.answer.next(confirm(this.message));
        } else {
            this.answer.next(true);
        }
    }
}