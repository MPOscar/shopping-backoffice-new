import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { User } from '../../models/users';

@Component({
    selector: 'user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserFormComponent extends BaseReactiveFormComponent<User> implements OnInit {

    constructor(translateService: TranslateService) {
        super(translateService);
        //setTranslations(this.translateService, TRANSLATIONS);TODO
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
            firstName: new FormControl(this.data.firstName, [Validators.required]),   
            lastName: new FormControl(this.data.lastName, [Validators.required]),  
            middleName: new FormControl(this.data.middleName, [Validators.required]), 
            email: new FormControl(this.data.email, [Validators.required]),
            roleId: new FormControl(this.data.roleId, [Validators.required]), 
            isDeleted: new FormControl(this.data.isDeleted, [Validators.required]),   
            //createdBy: new FormControl(this.data.createdBy, [Validators.required]),TODO   
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

