import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { ImageCardComponent } from '../../../../../ui/modules/image-card/components/image-card/image-card.component';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { LinkShopsBrandModalComponent } from '../../../ms-shops/components/link-shops-brand/link-shops-brand-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Shop } from '../../../ms-shops/models/shops';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Hottest } from '../../models/layout';

const errorKey = 'Error';

@Component({
    selector: 'hottest-form',
    templateUrl: './hottest-form.component.html',
    styleUrls: ['./hottest-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HottestFormComponent extends BaseReactiveFormComponent<Hottest> implements OnInit {

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    faces: FormControl;

    @Input() brandId: string;

    linkedShops: Array<any>;

    modalRef: MatDialogRef<LinkShopsBrandModalComponent>;

    shops: Array<Shop>;

    shops2: Array<Shop>;

    displayOnBrandsCount: number = 0;

    @ViewChild('shops') fileInput: ElementRef;

    @ViewChild(ImageCardComponent) imageCardComponent: ImageCardComponent;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private errorHandlingService: ErrorHandlingService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        translateService: TranslateService) {
        super(translateService);
        //setTranslations(this.translateService, TRANSLATIONS);TODO
    }

    ngOnInit() {
        this.shops = this.activatedRoute.snapshot.data.shops;
        this.shops2 = this.activatedRoute.snapshot.data.shops;
        let validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup()
    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            display: new FormControl(this.data.display, [Validators.required]),
            displayOnPage: new FormControl(this.data.displayOnPage),
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

