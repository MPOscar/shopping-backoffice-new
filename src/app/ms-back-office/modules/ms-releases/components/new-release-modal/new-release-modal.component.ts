import { Component, Inject, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { MainImage, Release, ReleaseImage } from '../../models/releases';
import { ReleaseService } from '../../services/releases.service';
import { ReleaseImagesService } from '../../services/releases-images.service';
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Style } from '../../../ms-style/models/style';
import { Shop } from '../../../ms-shops/models/shops';

const errorKey = 'Error';

const savedUserMessageKey = 'Saved User Message';

@Component({
    selector: 'new-release-modal',
    templateUrl: './new-release-modal.component.html',
    styleUrls: ['./new-release-modal.component.scss']
})

@Mixin([CanDeactivateMixin])
export class NewReleaseModalComponent implements CanDeactivateMixin, OnInit {

    data: Release = {
        name: '',
        description: '',
        sku: '',
        slug: '',
        hot: false,
        customized: false,
    };

    brands: Array<Brand>;

    collectionId: string;

    collections: Array<Collection>;

    styles: Array<Style>;

    shops: Array<Shop>;

    // Begin Mixin code of the CanDeactivate class
    unsavedChanges = false;

    cancelBtnKey = 'No';

    okBtnKey = 'Yes';

    saveTitleKey = 'Discard Title';

    saveMessageKey = 'Discard Message';

    modalRef: MatDialogRef<ConfirmDialogComponent>;

    canDeactivate: () => Observable<boolean> | boolean;

    dataChanged: () => void;

    releaseId: string;
    // end

    validationErrors: ValidationErrors;

    constructor(
        public activatedRoute: ActivatedRoute,
        public releasesService: ReleaseService,
        public releaseImagesService: ReleaseImagesService,
        private errorHandlingService: ErrorHandlingService,
        public imagesService: ImagesService,
        public router: Router,
        private toastr: ToastrService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<NewReleaseModalComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    }

    ngOnInit() {
        this.brands = this.dialogData.brands;
        this.collections = this.dialogData.collections;
        this.styles = this.dialogData.styles;
        this.collectionId = this.dialogData.collectionId;
        this.shops = this.dialogData.shops;
    }

    submit(data: Release) {
        this.createRelease(data);
    }

    cancel() {
        this.close();
    }

    close(id?: string) {
        this.dialogRef.close(id);
    }

    createRelease(releaseData: Release) {
        let closeFlag = true;
        this.releasesService.postRelease(releaseData).subscribe(response => {
            this.releaseId = response.data.id;
            releaseData.images = [];
            const imagesObservables = new Array<Observable<any>>();
            if (!releaseData.faces) {
                releaseData.faces = [];
            }
            for (const face of releaseData.faces) {
                // const face = releaseData.faces[position];
                if (face.mainImage === true) {
                    closeFlag = false;
                    this.imagesService.postImage(face.file).subscribe(response => {
                        let mainImage: MainImage = {
                            mainImage: response.data.url
                        };
                        this.releaseImagesService.patchReleaseMainImage(this.releaseId, mainImage).subscribe(response => {
                            this.close(this.releaseId);
                        },
                            (error: HandledError) => {
                                this.errorHandlingService.handleUiError(errorKey, error);
                                this.validationErrors = error.formErrors;
                            });
                        const image = new ReleaseImage;
                        image.imgUrl = response.data.url;
                        this.releaseImagesService.postReleaseImage(this.releaseId, image).subscribe(response => {
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
                    const subscription$ = this.imagesService.postImage(face.file);
                    imagesObservables.push(subscription$);
                }
            }

            if (imagesObservables.length > 0) {
                forkJoin(imagesObservables).subscribe(responses => {
                    for (const item of responses) {
                        const image = new ReleaseImage;
                        image.imgUrl = item.data.url;
                        releaseData.images = [...releaseData.images, image];
                    }
                    // send images realeases
                    this.releaseImagesService.postReleaseImageAll(response.data.id, releaseData.images).subscribe(response => {
                    },
                        (error: HandledError) => {
                            this.errorHandlingService.handleUiError(errorKey, error);
                            this.validationErrors = error.formErrors;
                        });
                    this.unsavedChanges = false;
                    if (closeFlag) {
                        this.close(this.releaseId);
                    }
                    this.toastr.success((savedUserMessageKey));

                },
                    (error: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, error);
                        this.validationErrors = error.formErrors;
                    }
                );
            } else {
                if (closeFlag) {
                    this.close(this.releaseId);
                }
            }
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
                this.validationErrors = error.formErrors;
            });
    }

}
