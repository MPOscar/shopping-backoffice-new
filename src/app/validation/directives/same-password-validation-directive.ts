import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {samePassword} from '../helpers/same-password-validator';

@Directive({
    selector: '[samePasswordValidation]',
    providers: [{provide: NG_VALIDATORS, useExisting: SamePasswordValidationDirective, multi: true}]
})
export class SamePasswordValidationDirective implements Validator {
    @Input('passwordToCompare') passwordToCompare: AbstractControl;

    validate(control: AbstractControl): { [key: string]: any } {
        return samePassword(this.passwordToCompare)(control);
    }
}
