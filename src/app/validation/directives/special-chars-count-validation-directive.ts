import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {specialChars} from '../helpers/special-chars-validator';

@Directive({
    selector: '[specialCharsCountValidation]',
    providers: [{provide: NG_VALIDATORS, useExisting: SpecialCharsCountDirective, multi: true}]
})
export class SpecialCharsCountDirective implements Validator {
    @Input('specialCharsCountValidation') specialCharsCount: number;

    validate(control: AbstractControl): { [key: string]: any } {
        return this.specialCharsCount ?
            specialChars(this.specialCharsCount)(control)
            : null;
    }
}
