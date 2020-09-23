import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Collection } from '../../models/collection';
import { Brand } from '../../../ms-brands/models/brand';
import { Release } from '../../../ms-releases/models/releases';
import { Style } from '../../../ms-style/models/style';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { Shop } from '../../../ms-shops/models/shops';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { CollectionsService } from '../../services/collections.service';
import { LinkOffersCollentionModalComponent } from '../../../ms-offers/components/link-offers-collection/link-offers-collection-modal.component';
import { SelectedShop } from '../../../ms-shops/models/selected-shop';

const errorKey = 'Error';

@Component({
    selector: 'see-collection',
    templateUrl: './see-collection.component.html',
    styleUrls: ['./see-collection.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SeeCollectionComponent extends BaseReactiveFormComponent<Collection> implements OnInit {

    @Input() brands: Array<Brand>;

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    @Input() collectionId: string;

    @Input() releases: Array<Release>;

    styles: Array<Style>;

    @Input() collections: Array<Collection>;

    faces: FormControl;

    linkedShops: Array<SelectedShop>;

    modalRef: MatDialogRef<LinkOffersCollentionModalComponent>;

    shops: Array<Shop>;

    shopsToShow: Array<Shop>;

    constructor(
        public activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        public collectionsService: CollectionsService,
        private errorHandlingService: ErrorHandlingService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        translateService: TranslateService,
        public dialogRef: MatDialogRef<SeeCollectionComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any) {
        super(translateService);
    }

    ngOnInit() {

        this.shops = this.dialogData.shops;
        this.principal = this.dialogData.data.imgUrl;
        this.collectionId = this.dialogData.collectionId;

        this.collectionsService.getCollectionLinkedShops(this.collectionId).subscribe(response => {
            this.linkedShops = response.data;
            // this.shops.forEach((shop) => {
            //     this.isLinked(shop.id);
            // });
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
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
    }

    createFormGroup() {
        this.faces = this.formBuilder.control(this.dialogData.faceList);
        this.formGroup = new FormGroup({
            name: new FormControl(this.dialogData.data.name, [Validators.required]),
            description: new FormControl(this.dialogData.data.description),
            brand: new FormControl(this.dialogData.data.brand, [Validators.required]),
        });
    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

    close() {
        this.dialogRef.close();
    }

}

