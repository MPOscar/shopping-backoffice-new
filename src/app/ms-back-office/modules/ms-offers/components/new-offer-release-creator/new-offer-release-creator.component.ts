import { Component, OnInit, Inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Offer } from '../../models/offer';
import { OffersService } from '../../services/offers.service';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';


const errorKey = 'Error';

const savedMessageKey = 'Saved';

const addOfferMessage = 'You must add at least one offer'

@Component({
    selector: 'new-offer-release-creator',
    templateUrl: './new-offer-release-creator.component.html',
    styleUrls: ['./new-offer-release-creator.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewOfferReleaseCreatorComponent implements CanDeactivateMixin, OnInit {

    data: Offer = {
        name: '',
        description: '',
        raffle: true
    };

    shops: Array<Shop>;

    releases: Array<Release>;

    // Begin Mixin code of the CanDeactivate class
    unsavedChanges = false;

    cancelBtnKey = 'No';

    okBtnKey = 'Yes';

    saveTitleKey = 'Discard Title';

    saveMessageKey = 'Discard Message';

    modalRef: MatDialogRef<ConfirmDialogComponent>;

    canDeactivate: () => Observable<boolean> | boolean;

    dataChanged: () => void;

    releaseId: string = 'F4ssss444t333r';

    validationErrors: ValidationErrors;

    shopToShow: Array<Shop> = [];

    offerList: Array<Offer> = [];

    constructor(
        public dialogRef: MatDialogRef<NewOfferReleaseCreatorComponent>,
        public activatedRoute: ActivatedRoute,
        public offersService: OffersService,
        private errorHandlingService: ErrorHandlingService,
        public router: Router,
        private toastr: ToastrService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public dialogData: any
    ) {
    }

    ngOnInit() {
        this.filterVirtualsShops();
        this.shops = this.dialogData.shops;
        this.releases = this.activatedRoute.snapshot.data.releases;
    }

    filterVirtualsShops() {
        this.shopToShow = this.dialogData.shops.filter((element: Shop) => {
            return (element.type === 'virtual');
        });
    }

    submit(offerList: Offer[]) {
        if (offerList.length > 0) {
            this.dialogRef.close(offerList);
        } else {
            this.toastr.error(addOfferMessage, errorKey);
        }
        // this.createOffer(offerList);
    }

    createOffer(offerList: Offer[]) {
        if (offerList.length) {
          this.offersService.postOffers(offerList).subscribe(response => {
            this.unsavedChanges = false;
            this.close();
          },
            (error: HandledError) => {
              this.errorHandlingService.handleUiError(errorKey, error, 'offer');
              this.validationErrors = error.formErrors;
            });
        }
      }

    cancel() {
        this.close();
    }

    close() {
        this.dialogRef.close();
    }

    // createOffer(data: Offer) {
    //     this.offersService.postOffer(data).subscribe(response => {
    //         this.unsavedChanges = false;
    //         this.close();
    //         this.toastr.success(savedMessageKey);
    //     },
    //         (error: HandledError) => {
    //             this.errorHandlingService.handleUiError(errorKey, error, 'offer');
    //             this.validationErrors = error.formErrors;
    //         });
    // }

}
