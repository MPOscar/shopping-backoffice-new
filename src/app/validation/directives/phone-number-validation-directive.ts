import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {phoneNumber} from '../helpers/phone-number-validator';

@Directive({
    selector: '[phoneNumberValidation]',
    providers: [{provide: NG_VALIDATORS, useExisting: PhoneNumberValidationDirective, multi: true}]
})
export class PhoneNumberValidationDirective implements Validator {

    validate(control: AbstractControl): { [key: string]: any } {
        return phoneNumber()(control);
    }
}
