import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { TranslateService } from '@ngx-translate/core';
//
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Brand } from '../../models/brand';
import { LinkShopsBrandModalComponent } from '../../../ms-shops/components/link-shops-brand/link-shops-brand-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'brand-form',
    templateUrl: './brand-form.component.html',
    styleUrls: ['./brand-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BrandFormComponent extends BaseReactiveFormComponent<Brand> implements OnInit {

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    faces: FormControl;

    modalRef: MatDialogRef<LinkShopsBrandModalComponent>;

    constructor(
        public dialog: MatDialog,
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
        this.faces = this.formBuilder.control(this.faceList);
        this.formGroup = new FormGroup({
            faces: this.faces,
            name: new FormControl(this.data.name, [Validators.required]),
            description: new FormControl(this.data.description),
            imgUrl: new FormControl(this.data.imgUrl),
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

