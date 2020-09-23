import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Url } from '../../models/urls';

@Component({
    selector: 'url-form',
    templateUrl: './url-form.component.html',
    styleUrls: ['./url-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UrlFormComponent extends BaseReactiveFormComponent<Url> implements OnInit {

    constructor(translateService: TranslateService) {
        super(translateService);
        //setTranslations(this.translateService, TRANSLATIONS);
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
            url: new FormControl(this.data.url, [Validators.required]),
            vanityUrl: new FormControl(this.data.vanityUrl, [Validators.required])                 
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

