import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
//
import { BaseReactiveFormComponent } from '../../../ui/components/base-reactive-form/base-reactive-form-component';
import { digitsCount } from '../../../validation/helpers/digits-count-validator';
import { lowercase } from '../../../validation/helpers/lowercase-validator';
import { samePassword } from '../../../validation/helpers/same-password-validator';
import { specialChars } from '../../../validation/helpers/special-chars-validator';
import { uppercase } from '../../../validation/helpers/uppercase-validator';
import { ChangePassword } from '../../models/change-password';
//import { setTranslations } from '@c/ngx-translate';
import { TranslateService } from '@ngx-translate/core';
import { TRANSLATIONS } from './i18n/change-password-form.component.translations';

@Component({
    selector: 'change-password-form',
    templateUrl: './change-password-form.component.html',
    styleUrls: ['./change-password-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChangePasswordFormComponent extends BaseReactiveFormComponent<ChangePassword> implements OnInit {

    password: FormControl;

    public capsLockOn: boolean;

    @Input() passwordSize: number;

    @Input() uppercase: number;

    @Input() lowercase: number;

    @Input() specialCharsCount: number;

    @Input() digitsCount: number;

    @Output() cancel = new EventEmitter();

    constructor(public translateService: TranslateService) {
        super(translateService);
        //setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {
        this.validationErrorMessages = [
            {
                type: 'required',
                key: '@c/authentication/ChangePasswordFormComponent/Required Field',
                params: null,
                translation: ''
            },
            {
                type: 'passwordStrength',
                key: '@c/authentication/ChangePasswordFormComponent/Password Strength',
                params: {
                    numberCount: this.digitsCount,
                    uppercase: this.uppercase,
                    lowercase: this.lowercase,
                    minSize: this.passwordSize,
                    specialCharacters: this.specialCharsCount
                }, translation: ''
            },
            {
                type: 'matchPassword',
                key: '@c/authentication/ChangePasswordFormComponent/Password Match',
                params: null,
                translation: ''
            }
        ];
        this.createFormGroup();
    }

    createFormGroup() {
        this.password = new FormControl(this.data.password, [
            Validators.required,
            Validators.maxLength(28),
            Validators.minLength(this.passwordSize),
            lowercase(this.lowercase),
            uppercase(this.uppercase),
            digitsCount(this.digitsCount),
            specialChars(this.specialCharsCount),
        ]);
        this.formGroup = new FormGroup({
            old_password: new FormControl(this.data.old_password, [Validators.required]),
            password: this.password,
            confirm_password: new FormControl(this.data.confirmPassword, [
                Validators.required,
                samePassword(this.password)
            ]),
        });
    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }
}
