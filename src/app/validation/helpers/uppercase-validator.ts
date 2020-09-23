import {AbstractControl, ValidatorFn} from '@angular/forms';

export function uppercase(minRequired: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const inputValue: String = control.value;
        if (inputValue && minRequired && minRequired > 0) {
            let regExp = new RegExp(/([^A-Z])/g);
            let valueSplit = inputValue.replace(regExp, '');
            let isValid: boolean = valueSplit.length >= minRequired ? true : false;
            return isValid ? null : {'passwordStrength': {'uppercaseCount': {value: control.value}}};
        }
        return null;
    };
}
