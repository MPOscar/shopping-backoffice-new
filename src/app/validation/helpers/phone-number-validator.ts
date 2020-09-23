import {AbstractControl, ValidatorFn} from '@angular/forms';

export function phoneNumber(): ValidatorFn{
    return (control: AbstractControl): { [key: string]: any } => {
        const inputValue: String = control.value;
        if (inputValue) {
            let regExp: RegExp = new RegExp(/^\+?\d{7,15}$/);
            let isValid: boolean = inputValue.match(regExp)? true: false;
            return isValid ? null : {'phoneNumber': {value: control.value}};
        }
        return null;
    };
}