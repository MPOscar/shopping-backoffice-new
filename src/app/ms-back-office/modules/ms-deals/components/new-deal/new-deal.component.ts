import { Component, Inject, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Deal } from '../../models/deal';
import { DealsService } from '../../services/deals.service';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';

const errorKey = 'Error';

const savedMessageKey = 'Saved';

@Component({
    selector: 'new-deal',
    templateUrl: './new-deal.component.html',
    styleUrls: ['./new-deal.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewDealComponent implements OnDestroy, CanDeactivateMixin {

    data: Deal = {
        imgUrl: '',
        displayOnSale: false,
    };

    // Begin Mixin code of the CanDeactivate class
    unsavedChanges = false;

    cancelBtnKey = 'No';

    okBtnKey = 'Yes';

    saveTitleKey = 'Discard Title';

    saveMessageKey = 'Discard Message';

    modalRef: MatDialogRef<ConfirmDialogComponent>;

    canDeactivate: () => Observable<boolean> | boolean;

    dataChanged: () => void;

    validationErrors: ValidationErrors;

    subscriptions: Array<Subscription> = [];

    constructor(
        public dialogRef: MatDialogRef<NewDealComponent>,
        public activatedRoute: ActivatedRoute,
        public dealsService: DealsService,
        private errorHandlingService: ErrorHandlingService,
        public imagesService: ImagesService,
        public router: Router,
        private toastr: ToastrService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public DialogData: any
    ) {
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    submit(data: Deal) {
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
                const subPostImage = this.imagesService.postImage(face.file).subscribe(response => {
                    dealData.imgUrl = response.data.url;
                    this.createDeal(dealData);
                },
                    (error: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, error);
                        this.validationErrors = error.formErrors;
                    });
                this.subscriptions.push(subPostImage);
            }
        } else {
            this.createDeal(dealData);
        }
    }

    createDeal(deal: Deal) {
        const subPostDeal = this.dealsService.postDeal(deal).subscribe(response => {
            this.unsavedChanges = false;
            this.close();
            this.toastr.success(savedMessageKey);
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error, 'deal');
                this.validationErrors = error.formErrors;
            });
        this.subscriptions.push(subPostDeal);
    }
}
