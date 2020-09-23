import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
//
import { environment } from '../../../../../../environments/environment.prod';
//
import { BecomePartner } from '../../models/become-partner';

const errorKey = 'Error';

@Component({
    selector: 'become-partner-form',
    templateUrl: './become-partner-form.component.html',
    styleUrls: ['./become-partner-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BecomePartnerFormComponent extends BaseReactiveFormComponent<BecomePartner> implements OnInit {

    AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '25rem',
        minHeight: '5rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        uploadUrl: environment.apiUrl + 'image/editor/', // if needed
        customClasses: [ // optional
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ]
    };

    faces: FormControl;

    constructor(
        private formBuilder: FormBuilder,
        translateService: TranslateService) {
        super(translateService);
        // setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {
        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();
    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            value: new FormControl(this.data.value, [Validators.required]),
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

