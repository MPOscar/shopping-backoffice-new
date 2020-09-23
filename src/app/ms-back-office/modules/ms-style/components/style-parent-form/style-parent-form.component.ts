import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Brand } from '../../../ms-brands/models/brand';
import { BrandsService } from '../../../ms-brands/services/brands.service';
import { Shop } from '../../../ms-shops/models/shops';
import { Category } from '../../../ms-categories/models/category';
import { Style } from '../../models/style';
import { StylesService } from '../../services/styles.service';

import { NewBrandComponent } from '../../../ms-brands/components/new-brand/new-brand.component';
import { ShopsSellingStyleModalComponent } from '../../../ms-shops/components/shops-selling-style-modal/shops-selling-style-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'style-parent-form',
    templateUrl: './style-parent-form.component.html',
    styleUrls: ['./style-parent-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class StyleParentFormComponent extends BaseReactiveFormComponent<Style> implements OnInit {

    @Input() brands: Array<Brand>;

    @Input() categories: Array<Category>;

    @Input() isParent: boolean = false;

    @Input() styles: Array<Style>;

    @Input() styleId: string;

    @Input() shops: Array<Shop>;

    allStyles: Array<Style>;

    modalRef: MatDialogRef<NewBrandComponent | ShopsSellingStyleModalComponent>;

    shop: Shop;

    createRelease: boolean = false;

    constructor(
        public dialog: MatDialog,
        public location: Location,
        public brandsService: BrandsService,
        public stylesService: StylesService,
        translateService: TranslateService) {
        super(translateService);
        //setTranslations(this.translateService, TRANSLATIONS);
    }

    ngOnInit() {

        this.styles = this.styles.filter(style => {
            return style.isParent;
        });

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

        this.allStyles = this.styles;
    }

    createFormGroup() {

        this.formGroup = new FormGroup({
            name: new FormControl(this.data.name, [Validators.required]),
            description: new FormControl(this.data.description),
            brand: new FormControl(this.data.brand, [Validators.required]),
            // parent: new FormControl(this.data.parent),
            categories: new FormControl(this.data.categories, [Validators.required]),
            isParent: new FormControl(true)
        });

    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

    showModalStoresSelling() {
        this.modalRef = this.dialog.open(ShopsSellingStyleModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                styleId: this.styleId,
                shops: this.shops,
            }
        });
    }

    showModalAddNewBrand() {
        this.modalRef = this.dialog.open(NewBrandComponent, {
            height: '90%',
            width: '90%',
            data: { face: this.shop }
        });

        this.modalRef.afterClosed().subscribe(() => {
            this.brandsService.getAllBrands().subscribe((response) => {
                this.brands = response;
            });
        });
    }

    selectParent(brandId: string) {
        this.stylesService.getAllStyles().subscribe((response) => {
            if (brandId) {
                this.styles = response.filter(style => {
                    return (style.brand === brandId) && style.isParent;
                });
            }
            else {
                this.styles = response;
            }
        });
    }

    selectBrand(brandId: string) {
        this.brandsService.getAllBrands().subscribe((response) => {
            if (brandId) {
                this.brands = response.filter(brand => {
                    return brand.id === brandId;
                });
            }
            else {
                this.brands = response;
            }
        });
    }
}

