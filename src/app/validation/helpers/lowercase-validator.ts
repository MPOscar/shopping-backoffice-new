import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function lowercase(minRequired: number): ValidatorFn {
    return (control: FormControl): { [key: string]: any } => {
        const inputValue: String = control.value;
        if (inputValue && minRequired && minRequired > 0) {
            let regExp = new RegExp(/([^a-z])/g);
            let valueSplit = inputValue.replace(regExp, '');
            let isValid: boolean = valueSplit.length >= minRequired ? true : false;
            return isValid ? null : {'passwordStrength': {'lowercaseCount': {value: control.value}}};
        }
        return null;
    };
}