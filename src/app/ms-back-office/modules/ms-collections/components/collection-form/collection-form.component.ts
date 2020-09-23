import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Collection } from '../../models/collection';
import { Brand } from '../../../ms-brands/models/brand';

@Component({
    selector: 'collection-form',
    templateUrl: './collection-form.component.html',
    styleUrls: ['./collection-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionFormComponent extends BaseReactiveFormComponent<Collection> implements OnInit {

    @Input() brands: Array<Brand>;

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    faces: FormControl;

    facesValid = true;

    constructor(
        private formBuilder: FormBuilder,
        translateService: TranslateService) {
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
        this.faces = this.formBuilder.control(this.faceList, [Validators.required]);
        this.formGroup = new FormGroup({
            faces: this.faces,
            name: new FormControl(this.data.name, [Validators.required]),
            description: new FormControl(this.data.description),
            brand: new FormControl(this.data.brand, [Validators.required]),
            //updatedAt: new FormControl(this.data.updatedAt)            
        });

    }

    get facesControl() { return this.formGroup.get('faces') as FormControl; }

    submitClicked() {

        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
            this.facesValid = this.facesControl.valid;

        }
    }
}

