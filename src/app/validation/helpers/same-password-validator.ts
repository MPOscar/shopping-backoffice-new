import { AbstractControl, ValidatorFn } from '@angular/forms';

export function samePassword(passwordToCompareControl: AbstractControl): ValidatorFn {
    let currentControl: AbstractControl;
    return (control: AbstractControl): { [key: string]: any } => {

        const inputValue: String = control.value;

        if (!currentControl) {
            currentControl = control;
            if (!passwordToCompareControl) {
                throw new Error(`samePasswordValidator(): control to compare was not found`);
            }

            passwordToCompareControl.valueChanges.subscribe((passwordToCompareValue) => {
                if (inputValue) {
                    if (passwordToCompareValue !== currentControl.value) {
                        currentControl.setErrors({matchPassword: true});
                    } else {
                        currentControl.setErrors(null);
                    }
                }
            });
        }

        if (inputValue) {
            if (passwordToCompareControl.value !== currentControl.value) {
                return {
                    matchPassword: true
                }
            }
        }

        return null;
    };
}
