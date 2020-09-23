import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
//
import { environment } from '../../../../../../environments/environment.prod';
//
import { WhoAreWe } from '../../models/who-are-we';

const errorKey = 'Error';

@Component({
    selector: 'who-are-we-form',
    templateUrl: './who-are-we-form.component.html',
    styleUrls: ['./who-are-we-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class WhoAreWeFormComponent extends BaseReactiveFormComponent<WhoAreWe> implements OnInit {

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

