import {AfterViewInit, Component, ContentChild, EventEmitter, Input, Inject, Output, OnInit, TemplateRef} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
//
import {TranslateService} from '@ngx-translate/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs';
//
import {ReleaseImagesService} from '../../services/releases-images.service';
import {ReleaseService} from '../../services/releases.service';
import {Face, State, Status} from '../../../../../ui/modules/images-card/models/face';
import {ErrorHandlingService} from '../../../../../error-handling/services/error-handling.service';
import {HandledError} from '../../../../../error-handling/models/handled-error';
import {ToastrService} from '../../../../../error-handling/services/toastr.service';
import {ImagesService} from '../../../../../ui/modules/images-card/services/images.service';
import {CanDeactivateMixin} from '../../../../../ui/helpers/component-can-deactivate';
import {ConfirmDialogComponent} from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import {Mixin} from '../../../../../ui/helpers/mixin-decorator';
import {Collection} from '../../../ms-collections/models/collection';
import {Release, EditReleaseModel, ReleaseImage, MainImage} from '../../models/releases';
//import { setTranslations } from 'ngx-translate';
//import { TRANSLATIONS } from './i18n/edit-case.component.translations';
import {PropertyCase} from '../../models/property-case';
import {ImageCardEditActionDirective} from '../../../../../ui/modules/images-card/directives/images-card-edit-actions.directive';
import {NewOfferComponent} from '../../../ms-offers/components/new-offer/new-offer.component';
import {Brand} from '../../../ms-brands/models/brand';
import {Shop} from '../../../ms-shops/models/shops';
import {Style} from '../../../ms-style/models/style';

const errorKey = 'Error';

const savedCaseMessageKey = 'Saved Changes';

@Component({
    selector: 'edit-release-modal',
    templateUrl: './edit-release-modal.component.html',
    styleUrls: ['./edit-release-modal.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditReleaseModalComponent implements AfterViewInit, OnInit, CanDeactivateMixin {

    data: Release;

    imageList: ReleaseImage[];

    validationErrors: ValidationErrors;

    // Begin Mixin code of the CanDeactivate class
    unsavedChanges = false;

    cancelBtnKey = 'No';

    okBtnKey = 'Yes';

    saveTitleKey = 'Discard';

    saveMessageKey = 'Discard Changes';

    modalRef: MatDialogRef<EditReleaseModalComponent | ConfirmDialogComponent | NewOfferComponent>;

    canDeactivate: () => Observable<boolean> | boolean;

    dataChanged: () => void;

    releaseId: string;

    @Input() galleries: Array<string>;

    @Input() caseProperties: Array<PropertyCase>;

    @Input() collections: Array<Collection>;

    @Input() collectionId: string;

    @Input() brands: Array<Brand>;

    @Input() styles: Array<Style>;

    @Input() shops: Array<Shop>;

    @ContentChild(ImageCardEditActionDirective, {read: TemplateRef}) imageCardEditActionTemplate;

    constructor(
        public releaseImagesService: ReleaseImagesService,
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private releasesService: ReleaseService,
        public router: Router,
        private errorHandlingService: ErrorHandlingService,
        private translate: TranslateService,
        private imagesService: ImagesService,
        public dialogRef: MatDialogRef<EditReleaseModalComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any
    ) {
        // setTranslations(this.translate, TRANSLATIONS);
    }

    ngAfterViewInit() {

    }

    ngOnInit() {
        this.brands = this.activatedRoute.snapshot.data.brands;
        this.collections = this.activatedRoute.snapshot.data.collections;
        this.imageList = this.activatedRoute.snapshot.data.releaseAllImages;
        this.releaseId = this.dialogData.releaseId;
        this.collectionId = this.dialogData.collectionId;
        this.shops = this.activatedRoute.snapshot.data.shops;

        this.getCase();
        this.releaseImagesService.getReleaseAllImages(this.dialogData.releaseId).subscribe(response => {
            this.imageList = response.data;
            this.imageList.forEach((image) => {
                image.fileName = '';
            });


        });

    }

    submit(data: Release) {
        delete data.updatedAt;
        this.editCase(data);
    }

    cancel() {
        this.close();
    }

    close() {
        this.dialogRef.close();
    }

    getCase() {
        this.releasesService.getRelease(this.dialogData.releaseId).subscribe(response => {
                this.data = response.data;
                if (this.data.mainImage) {
                    this.dialogData.imageList.forEach((image) => {
                        image.fileName = '';
                        if (image.imgUrl === this.data.mainImage) {
                            image.mainImage = true;
                        }
                    });
                }
                this.data.faces = this.dialogData.imageList;
            },
            (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
    }

    editCase(releaseData: Release) {
        let mainImageFlag = false;
        let closeFlag = true;
        if (releaseData !== undefined && releaseData !== null) {
            // Saving the images of the case before saving the case
            releaseData.images = [];
            const imagesObservables = new Array<Observable<any>>();
            const addedFaces = new Array<Face>();
            // Uploading the images to command and control server
            for (const position in releaseData.faces) {
                const face = releaseData.faces[position];
                if (face.state === State.New) {
                    face.status = Status.Uploading;
                    if (face.mainImage === true) {
                        closeFlag = false;
                        mainImageFlag = true;
                        this.imagesService.postImage(face.file).subscribe(response => {
                                const image = new ReleaseImage;
                                image.imgUrl = response.data.url;
                                const mainImage: MainImage = {
                                    mainImage: image.imgUrl
                                };
                                releaseData.mainImage = image.imgUrl;
                                this.releasesService.putRelease(releaseData).subscribe(response => {
                                    this.close();
                                });

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
                    addedFaces.push(face);
                } else if (face.mainImage === true) {
                    mainImageFlag = true;
                    const mainImage: MainImage = {
                        mainImage: face.imgUrl
                    };
                    releaseData.mainImage = face.imgUrl;
                }
            }
            if (imagesObservables.length > 0) {

                forkJoin(imagesObservables).subscribe(responses => {
                        for (const item in responses) {
                            if (!mainImageFlag) {
                                releaseData.mainImage = responses[item].data.url;
                                this.releasesService.putRelease(releaseData).subscribe(response => {
                                });
                                mainImageFlag = true;
                            }
                            const image = new ReleaseImage;
                            image.imgUrl = responses[item].data.url;
                            releaseData.images = [...releaseData.images, image];
                        }
                        this.releaseImagesService.postReleaseImageAll(releaseData.id, releaseData.images).subscribe(response => {
                            },
                            (error: HandledError) => {
                                this.errorHandlingService.handleUiError(errorKey, error);
                                this.validationErrors = error.formErrors;
                            });

                        if (!mainImageFlag) {
                            releaseData.mainImage = '';
                        }
                        this.releasesService.putRelease(releaseData).subscribe(response => {
                                this.unsavedChanges = false;
                                this.data = response;
                                this.translate.get(savedCaseMessageKey).subscribe(value => {
                                    this.toastr.success(value);
                                });
                                if (closeFlag) {
                                    this.close();
                                }
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
                if (!mainImageFlag) {
                    releaseData.mainImage = '';
                }
                this.releasesService.putRelease(releaseData).subscribe(response => {
                        this.unsavedChanges = false;
                        this.data = response;
                        this.translate.get(savedCaseMessageKey).subscribe(value => {
                            this.toastr.success(value);
                        });
                        if (closeFlag) {
                            this.close();
                        }
                    },
                    (error: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, error);
                        this.validationErrors = error.formErrors;
                    });
            }
        }
    }

}
