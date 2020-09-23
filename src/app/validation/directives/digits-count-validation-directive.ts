import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {digitsCount} from '../helpers/digits-count-validator';

@Directive({
    selector: '[digitsCountValidation]',
    providers: [{provide: NG_VALIDATORS, useExisting: DigitsCountValidationDirective, multi: true}]
})
export class DigitsCountValidationDirective implements Validator {
    @Input('digitsCountValidation') digitsCount: number;

    validate(control: AbstractControl): { [key: string]: any } {
        return this.digitsCount ?
            digitsCount(this.digitsCount)(control)
            : null;
    }
}
