import { AfterViewInit, EventEmitter, Input, OnDestroy, Output, Directive } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslatedValidationError } from '../../modules/error-messages/models/translated-validation-error';

@Directive()
export abstract class BaseReactiveFormComponent<T> implements OnDestroy, AfterViewInit {

    onLangChange$: Subscription;

    formGroupValueChanges$: Subscription;

    showValidationError = true;

    _data: T;

    private _validationErrorMessages: TranslatedValidationError[] = [];

    _validationErrors: ValidationErrors[];

    @Output() accept = new EventEmitter<T>();

    @Output() cancel = new EventEmitter();

    @Output() dataChange = new EventEmitter<T>();

    public formGroup: FormGroup;


    protected constructor(public translateService: TranslateService) {
        this.onLangChange$ = this.translateService.onLangChange.subscribe(() => {
            this.translateValidationErrorMessages();
            this.onLanguageChange();
        });
    }

    public get data(): T {
        return this._data;
    }

    @Input()
    public set data(value: T) {
        this._data = value;
    }

    @Input() set validationErrors(validationErrors: ValidationErrors[]) {
        this._validationErrors = validationErrors;
        this.updateValidationAndValidity();
    }

    get validationErrors(): ValidationErrors[] {
        return this._validationErrors;
    }


    get validationErrorMessages(): TranslatedValidationError[] {
        return this._validationErrorMessages;
    }

    set validationErrorMessages(value: TranslatedValidationError[]) {
        this._validationErrorMessages = value;
        this.translateValidationErrorMessages();
    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.accept.emit(this._data);
        } else {
            this.triggerValidation();
        }
    }

    cancelClicked() {
        this.cancel.emit();
    }

    triggerValidation() {
        this.executeInAllFormControls((path, formControl) => {
            formControl.markAsTouched();
            formControl.updateValueAndValidity();
        });
    }

    ngAfterViewInit() {
        this.formGroupValueChanges$ = this.formGroup.valueChanges.subscribe(values => {
            if (this.formGroup.dirty) {
                this.data = Object.assign(this.data, this.formGroup.value);
                this.dataChange.emit();
            }
        });
        this.onAfterViewInit();
    }

    ngOnDestroy() {
        if (this.formGroupValueChanges$) {
            this.formGroupValueChanges$.unsubscribe();
        }
        if (this.onLangChange$) {
            this.onLangChange$.unsubscribe();
        }
        this.onDestroy();
    }

    private updateValidationAndValidity() {
        if (this.validationErrors) {
            this.executeInAllFormControls((path: string[], formControl: FormControl, data: ValidationErrors) => {
                let control = data;
                for (let key of path) {
                    if (control[key]) {
                        if (typeof control[key] === 'string' || control[key].length > 0) {
                            formControl.setErrors({message: control[key]});
                        } else {
                            control = control[key]
                        }
                    }
                }
            }, this.validationErrors);
        }
    }

    executeInAllFormControls(actionToExecute: (path: string[], formControl: FormControl, data: any) => void, data?: any) {
        Object.keys(this.formGroup.controls).forEach(field => {
            const item = this.formGroup.controls[field];
            let path = [];
            path.push(field);
            this.executeInControl(path, item, actionToExecute, data);
        })
    }

    executeInControl(path: string[], item: AbstractControl,
                     actionToExecute: (path: string[], formControl: FormControl, data?: any) => void, data: any) {
        if (item instanceof FormControl) {
            actionToExecute(path, item, data);
            path.pop();
        } else if (item instanceof FormGroup || item instanceof FormArray) {
            Object.keys(item.controls).forEach(field => {
                const control = item.controls[field];
                path.push(field);
                this.executeInControl(path, control, actionToExecute, data);
            });
        } else {
            return;
        }
    }

    translateValidationErrorMessages(this: BaseReactiveFormComponent<T>): void {
        let newTranslations: TranslatedValidationError[] = [];
        this.validationErrorMessages.forEach((value: TranslatedValidationError) => {
            newTranslations.push({
                type: value.type,
                key: value.key,
                params: value.params,
                translation: this.translateService.instant(value.key, value.params)
            })
        });
        this._validationErrorMessages = newTranslations;
    }

    onLanguageChange() {
    }

    onDestroy() {
    }

    onAfterViewInit() {
    }

}
