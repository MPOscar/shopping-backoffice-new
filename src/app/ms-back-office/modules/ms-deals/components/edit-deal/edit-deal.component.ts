import { AfterViewInit, Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//
import { Face, MainImage, State, Status } from '../../../../../ui/modules/images-card/models/face';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Deal } from '../../models/deal';
import { DealsService } from '../../services/deals.service';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';

//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedMessageKey = 'Updated';

@Component({
    selector: 'edit-deal',
    templateUrl: './edit-deal.component.html',
    styleUrls: ['./edit-deal.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditDealComponent implements OnInit, AfterViewInit, OnDestroy, CanDeactivateMixin {

    data: Deal;

    validationErrors: ValidationErrors;

    deals: Array<Deal>;

    // Begin Mixin code of the CanDeactivate class
    unsavedChanges = false;

    cancelBtnKey = 'No';

    okBtnKey = 'Yes';

    saveTitleKey = 'Discard';

    saveMessageKey = 'Discard ';

    modalRef: MatDialogRef<ConfirmDialogComponent>;

    canDeactivate: () => Observable<boolean> | boolean;

    dataChanged: () => void;

    faceList: Array<Face> = [];

    principal: Face;

    dealId: string;

    subscriptions: Array<Subscription> = [];

    constructor(
        public activatedRoute: ActivatedRoute,
        public dealsService: DealsService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<EditDealComponent>,
        private errorHandlingService: ErrorHandlingService,
        public imagesService: ImagesService,
        public router: Router,
        public snackBar: MatSnackBar,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public dialogData: any
    ) {
    }

    ngOnInit() {
        this.dealId = this.dialogData.dealId;
    }

    ngAfterViewInit() {
        this.getDeal();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    getDeal() {
        const subGetDeal = this.dealsService.getDeal(this.dealId)
            .subscribe(
                response => {
                    this.data = response.data;
                    if (this.data.imgUrl) {
                        const face: Face = {
                            imgUrl: this.data.imgUrl,
                        };
                        this.faceList = [face];
                        this.principal = face;
                    }
                },
                (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
            );
        this.subscriptions.push(subGetDeal);
    }

    submit(data: Deal) {
        delete data.updatedAt;
        delete data.createdAt;
        this.save(data);
    }

    cancel() {
        this.close();
    }

    close() {
        this.dialogRef.close();
    }

    save(dealData: Deal) {
        if (dealData.faces && dealData.faces.length > 0) {
            for (const face of dealData.faces) {
                // const face = dealData.faces[position];
                if (face.state === State.New) {
                    const subPostImage = this.imagesService.postImage(face.file).subscribe(response => {
                        dealData.imgUrl = response.data.url;
                        this.updateDeal(dealData);
                    },
                        (error: HandledError) => {
                            this.errorHandlingService.handleUiError(errorKey, error);
                            this.validationErrors = error.formErrors;
                        });
                    this.subscriptions.push(subPostImage);
                } else {
                    this.updateDeal(dealData);
                }
            }
        } else {
            this.updateDeal(dealData);
        }
    }

    updateDeal(deal: Deal) {
        const subPutDeal = this.dealsService.putDeal(deal).subscribe(response => {
            this.unsavedChanges = false;
            this.close();
            this.toastr.success(updatedMessageKey);
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
                this.validationErrors = error.formErrors;
            });
        this.subscriptions.push(subPutDeal);
    }
}
