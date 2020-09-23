import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Category } from '../../models/category';
import { Face } from 'src/app/ui/modules/images-card/models/face';

@Component({
    selector: 'category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CategoryFormComponent extends BaseReactiveFormComponent<Category> implements OnInit {

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

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
            name: new FormControl(this.data.name, [Validators.required]),
            description: new FormControl(this.data.description),
            imgUrl: new FormControl(this.data.imgUrl),
            faces: new FormControl(this.faceList)
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

