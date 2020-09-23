import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { ImageCardComponent } from '../../../../../ui/modules/image-card/components/image-card/image-card.component';

import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { LayoutHeading } from '../../models/layout';
import { LayoutService } from '../../services/layout.service';

@Component({
    selector: 'heading-form',
    templateUrl: './heading-form.component.html',
    styleUrls: ['./heading-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeadingFormComponent extends BaseReactiveFormComponent<LayoutHeading> implements OnInit {

    faces: FormControl;

    @ViewChild(ImageCardComponent) imageCardComponent: ImageCardComponent;

    constructor(public dialog: MatDialog,
        private formBuilder: FormBuilder,
        public translateService: TranslateService) {
        super(translateService);
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
        if (this.data.imgUrl) {
            const face: Face = {
                imgUrl: this.data.imgUrl,
                state: State.Edited
            };
            this.formGroup.get('images').setValue([face]);
            this.imageCardComponent.initialize(face);
        }
    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            title: new FormControl(this.data.title),
            keywords: new FormControl(this.data.keywords),
            description: new FormControl(this.data.description),
            displayOnPage: new FormControl(this.data.displayOnPage),
            images: new FormControl(),
        });
    }

    submitClicked() {
        if (this.formGroup.valid) {
           // this.data = this.formGroup.value
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

}

