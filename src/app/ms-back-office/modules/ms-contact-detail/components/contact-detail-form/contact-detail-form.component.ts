import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { environment } from '../../../../../../environments/environment.prod';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { ContactDetail } from '../../models/contact-detail';
import { Brand } from '../../../ms-brands/models/brand';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';

@Component({
    selector: 'contact-detail-form',
    templateUrl: './contact-detail-form.component.html',
    styleUrls: ['./contact-detail-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContactDetailFormComponent extends BaseReactiveFormComponent<ContactDetail> implements OnInit {

    constructor(
        private formBuilder: FormBuilder,
        translateService: TranslateService) {
        super(translateService);
    }

    ngOnInit() {
        let validationsErrors: any[] = [
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
            timePeriodStart: new FormControl(this.data.timePeriodStart ? this.data.timePeriodStart : "00:00", [Validators.required]),
            timePeriodEnd: new FormControl(this.data.timePeriodEnd ? this.data.timePeriodEnd : "00:00", [Validators.required]),
            workingHours: new FormControl(this.data.workingHours, [Validators.required]),
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

