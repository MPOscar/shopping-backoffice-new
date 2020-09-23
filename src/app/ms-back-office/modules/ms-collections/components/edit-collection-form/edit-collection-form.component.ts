import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { Face } from '../../../../../ui/modules/images-card/models/face';
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

const errorKey = 'Error';

@Component({
    selector: 'edit-collection-form',
    templateUrl: './edit-collection-form.component.html',
    styleUrls: ['./edit-collection-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditCollectionFormComponent extends BaseReactiveFormComponent<Collection> implements OnInit {

    @Input() brands: Array<Brand>;

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    @Input() collectionId: string;

    @Input() releases: Array<Release>;

    styles: Array<Style>;

    @Input() collections: Array<Collection>;

    faces: FormControl;

    facesValid = true;

    linkedShops: Array<any>;

    modalRef: MatDialogRef<LinkOffersCollentionModalComponent>;

    shops: Array<Shop>;

    // shopsToShow: Array<Shop>;

    // selectedShop: any;

    // linkText = new FormControl();

    // linkUrl = new FormControl();

    // thereIsAselectedShop: boolean = false;

    @ViewChild('container') fileInput: ElementRef;

    constructor(
        public activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        public collectionsService: CollectionsService,
        private errorHandlingService: ErrorHandlingService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        translateService: TranslateService) {
        super(translateService);
    }

    ngOnInit() {
        this.brands = this.activatedRoute.snapshot.data.brands;
        this.collections = this.activatedRoute.snapshot.data.collections;
        this.shops = this.activatedRoute.snapshot.data.shops;
        this.styles = this.activatedRoute.snapshot.data.styles;

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
        this.faces = this.formBuilder.control(this.faceList, [Validators.required]);
        this.formGroup = new FormGroup({
            faces: this.faces,
            name: new FormControl(this.data.name, [Validators.required]),
            description: new FormControl(this.data.description),
            brand: new FormControl(this.data.brand, [Validators.required])
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

    linkOffersModal() {
        this.modalRef = this.dialog.open(LinkOffersCollentionModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                collectionId: this.collectionId,
                shops: this.shops,
                releases: this.releases,
                collections: this.collections

            }
        });
    }
}

