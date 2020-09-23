import { Component, AfterViewInit, Inject, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//

import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';
//
import { Face, State, Status } from '../../../../../ui/modules/images-card/models/face';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { FilterItem } from '../../models/filters';
import { LayoutHeading } from '../../models/layout';
import { LayoutService } from '../../services/layout.service';
import { HeadingFormComponent } from '../heading-form/heading-form.component';
//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedMessageKey = 'Updated';

@Component({
    selector: 'edit-heading',
    templateUrl: './edit-heading.component.html',
    styleUrls: ['./edit-heading.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditHeadingComponent implements OnInit, CanDeactivateMixin {

    data: LayoutHeading;

    validationErrors: ValidationErrors;

    Urls: Array<LayoutHeading>;

    // Begin Mixin code of the CanDeactivate class
    unsavedChanges = false;

    cancelBtnKey = 'No';

    okBtnKey = 'Yes';

    saveTitleKey = 'Discard Title';

    saveMessageKey = 'Discard Message';

    modalRef: MatDialogRef<ConfirmDialogComponent>;

    canDeactivate: () => Observable<boolean> | boolean;

    dataChanged: () => void;

    urlId: string;

    @Input() filters: any;

    @Input() pageId: string;

    @Input() brands: Array<Brand>;

    @Input() categories: Array<Category>;

    @Input() collections: Array<Collection>;

    @Input() releases: Array<Release>;

    @Input() shops: Array<Shop>;

    @Input() styles: Array<Style>;

    // @ViewChild(HeadingFormComponent) headingFormComponent;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private imagesService: ImagesService,
        public layoutService: LayoutService,
        private errorHandlingService: ErrorHandlingService,
        public router: Router,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private toastr: ToastrService,
    ) {
        //setTranslations(this.translate, TRANSLATIONS);
    }

    ngOnInit() {
        this.getUrl();
    }

    getUrl() {
        this.layoutService.getLayout(this.pageId, 'heading').subscribe(response => {
            this.data = response.data;
            // this.headingFormComponent.createFormGroupData(response.data);
        },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
        );
    }

    submit(data: any) {
        this.updateHeading(data);
    }

    cancel() {
        this.close();
    }

    close() {
    }




    updateHeading(data: LayoutHeading) {
        if (data.images) {
            for (const face of data.images) {
                // const face = headerData.images[position];
                if (face.state === State.New) {
                    this.imagesService.postImage(face.file).subscribe(response => {
                        data.imgUrl = response.data.url;
                        data.imgUrl = response.data.url;
                        this.layoutService.putLayoutHeading(this.pageId, 'heading', data).subscribe(response => {
                            this.unsavedChanges = false;
                            this.close();
                            this.toastr.success(updatedMessageKey);
                        },
                            (error: HandledError) => {
                                this.errorHandlingService.handleUiError(errorKey, error);
                                this.validationErrors = error.formErrors;
                            });
                    },
                        (error: HandledError) => {
                            this.errorHandlingService.handleUiError(errorKey, error);
                            this.validationErrors = error.formErrors;
                        });
                } else {
                    this.layoutService.putLayoutHeading(this.pageId, 'heading', data).subscribe(response => {
                        this.unsavedChanges = false;
                        this.close();
                        this.toastr.success(updatedMessageKey);
                    },
                        (error: HandledError) => {
                            this.errorHandlingService.handleUiError(errorKey, error);
                            this.validationErrors = error.formErrors;
                        });
                }
            }
        } else {
            this.layoutService.putLayoutHeading(this.pageId, 'heading', data).subscribe(response => {
                this.unsavedChanges = false;
                this.close();
                this.toastr.success(updatedMessageKey);
            },
                (error: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, error);
                    this.validationErrors = error.formErrors;
                });
        }
    }


}

