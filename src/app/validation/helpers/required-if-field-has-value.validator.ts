import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function requiredIfFieldHasValue(fieldName: string, values: Array<string>): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (!control.root) {
            return null;
        }
        
        let field = control.root.get(fieldName);
        if (!field) {
            return null;
        }

        return values.indexOf(field.value) > -1 ?
            Validators.required(control) : null;
    };
}
