import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {requiredIfFieldHasValue} from '../helpers/required-if-field-has-value.validator';

@Directive({
    selector: '[requiredIfFieldHasValueValidation]',
    providers: [{provide: NG_VALIDATORS, useExisting: RequiredIfFieldHasValueValidationDirective, multi: true}]
})
export class RequiredIfFieldHasValueValidationDirective implements Validator {
    @Input('requiredIfFieldHasValueValidation') fieldName: string;
    @Input() values: Array<string>;

    validate(control: AbstractControl): { [key: string]: any } {
        return this.fieldName && this.values ?
            requiredIfFieldHasValue(this.fieldName, this.values)(control) :
            null;
    }
}
