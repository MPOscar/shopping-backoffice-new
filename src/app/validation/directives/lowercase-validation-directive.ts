import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {lowercase} from '../helpers/lowercase-validator';

@Directive({
    selector: '[lowerCaseValidation]',
    providers: [{provide: NG_VALIDATORS, useExisting: LowercaseValidationDirective, multi: true}]
})
export class LowercaseValidationDirective implements Validator {
    @Input('lowerCaseValidation') lowercaseCount: number;

    validate(control: AbstractControl): { [key: string]: any } {
        return this.lowercaseCount ?
            lowercase(this.lowercaseCount)(control)
            : null;
    }
}
