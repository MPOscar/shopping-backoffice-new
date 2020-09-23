import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {uppercase} from '../helpers/uppercase-validator';

@Directive({
    selector: '[uppercaseValidation]',
    providers: [{provide: NG_VALIDATORS, useExisting: UppercaseValidationDirective, multi: true}]
})
export class UppercaseValidationDirective implements Validator {
    @Input('uppercaseValidation') uppercaseCount: number;

    validate(control: AbstractControl): { [key: string]: any } {
        return this.uppercaseCount ?
            uppercase(this.uppercaseCount)(control)
            : null;
    }
}
