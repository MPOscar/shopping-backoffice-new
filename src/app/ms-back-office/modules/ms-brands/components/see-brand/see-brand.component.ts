import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Brand, LinkedShop } from '../../models/brand';
import { BrandsService } from '../../services/brands.service';
import { LinkShopsBrandModalComponent } from '../../../ms-shops/components/link-shops-brand/link-shops-brand-modal.component';


import { Shop } from '../../../ms-shops/models/shops';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';

const errorKey = 'Error';

@Component({
    selector: 'see-brand',
    templateUrl: './see-brand.component.html',
    styleUrls: ['./see-brand.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SeeBrandComponent extends BaseReactiveFormComponent<Brand> implements OnInit {

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    faces: FormControl;

    @Input() brandId: string;

    linkedShops: Array<LinkedShop>;

    modalRef: MatDialogRef<LinkShopsBrandModalComponent>;

    shops: Array<Shop>;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public brandsService: BrandsService,
        private errorHandlingService: ErrorHandlingService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        translateService: TranslateService,
        public dialogRef: MatDialogRef<SeeBrandComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any) {
        super(translateService);
        //setTranslations(this.translateService, TRANSLATIONS);TODO
    }

    ngOnInit() {
        this.shops = this.activatedRoute.snapshot.data.shops;
        let validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.brandsService.getBrandLinkedShops(this.dialogData.id).subscribe(response => {
            this.linkedShops = response.data;
            this.shops = this.dialogData.shops;
            this.shops.forEach((shop) => {
                this.isLinked(shop.id);
            });
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();
    }

    createFormGroup() {
        this.faces = this.formBuilder.control(this.dialogData.faceList);
        this.formGroup = new FormGroup({
            faces: this.faces,
            name: new FormControl(this.dialogData.data.name, [Validators.required]),
            description: new FormControl(this.dialogData.data.description),
            imgUrl: new FormControl(this.dialogData.data.imgUrl),
        });

    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

    linkShopsModalBrand() {
        this.modalRef = this.dialog.open(LinkShopsBrandModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                brandId: this.brandId,
                shops: this.shops,
            }
        });
    }

    isLinked(id: string) {
        let isLinked = this.linkedShops.findIndex(linkedShop => linkedShop.shopId === id) > -1;
        if (isLinked) {
            let index = this.shops.findIndex(shop => shop.id === id);
            this.shops[index].linked = true;
            this.shops[index].checked = true;
        } else {
            let index = this.shops.findIndex(shop => shop.id === id);
            this.shops[index].linked = false;
            this.shops[index].checked = false;
        }

    }

    changeCollection(brandId: string) {
        this.brandId = brandId;
        this.brandsService.getBrandLinkedShops(brandId).subscribe(response => {
            this.linkedShops = response.data;
            this.shops.forEach((shop) => {
                this.isLinked(shop.id);
            });
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });
    }

    close() {
        this.dialogRef.close();
    }

}

