import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Brand } from '../../../ms-brands/models/brand';
import { BrandsService } from '../../../ms-brands/services/brands.service';
import { Shop } from '../../../ms-shops/models/shops';
import { Category } from '../../../ms-categories/models/category';
import { Style } from '../../models/style';
import { StylesService } from '../../services/styles.service';

import { NewBrandComponent } from '../../../ms-brands/components/new-brand/new-brand.component';
import { ShopsSellingStyleModalComponent } from '../../../ms-shops/components/shops-selling-style-modal/shops-selling-style-modal.component';

const errorKey = 'Error';

@Component({
    selector: 'see-style',
    templateUrl: './see-style.component.html',
    styleUrls: ['./see-style.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SeeStyleComponent extends BaseReactiveFormComponent<Style> implements OnInit {

    @Input() brands: Array<Brand>;

    @Input() categories: Array<Category>;

    @Input() style: Style;

    @Input() styleId: string;

    @Input() shops: Array<Shop>;

    @Input() styles: Array<Style>;

    modalRef: MatDialogRef<NewBrandComponent | ShopsSellingStyleModalComponent>;

    shop: Shop;

    constructor(
        public dialog: MatDialog,
        public location: Location,
        public brandsService: BrandsService,
        public stylesService: StylesService,
        private errorHandlingService: ErrorHandlingService,
        translateService: TranslateService,
        public dialogRef: MatDialogRef<SeeStyleComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any) {
        super(translateService);
        // setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {
        this.style = this.dialogData.styles.find(style => {
            return style.id === this.dialogData.data.parent;
        });

        this.styles = this.dialogData.styles;

        this.createFormGroup();

        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;
    }

    getParentName() {

    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            name: new FormControl(this.dialogData.data.name, [Validators.required]),
            description: new FormControl(this.dialogData.data.description),
            brand: new FormControl(this.dialogData.data.brand, [Validators.required]),
            categories: new FormControl(this.dialogData.data.categories, [Validators.required]),
            isParent: new FormControl(this.dialogData.data.isParent)
        });

        if (this.dialogData.data.parent) {
            const parentName = this.findParentName(this.dialogData.data.parent);
            this.formGroup.addControl('parent', new FormControl(parentName));
        }

    }

    findParentName(id) {
        const parent = this.styles.find(style => style.id === id);
        if (!parent) { return null; }
        return parent.name;
    }

    close() {
        this.dialogRef.close();
    }
}

