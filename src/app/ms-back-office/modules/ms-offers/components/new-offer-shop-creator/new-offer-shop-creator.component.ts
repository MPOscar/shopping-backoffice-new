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

@Component({
    selector: 'new-offer-shop-creator',
    templateUrl: './new-offer-shop-creator.component.html',
    styleUrls: ['./new-offer-shop-creator.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewOfferShopCreatorComponent implements CanDeactivateMixin, OnInit {

    data: Offer = {
        name: '',
        description: '',
        raffle: true,
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

    validationErrors: ValidationErrors;

    shopToShow: Array<Shop> = [];

    constructor(
        public dialogRef: MatDialogRef<NewOfferShopCreatorComponent>,
        public activatedRoute: ActivatedRoute,
        public offersService: OffersService,
        private errorHandlingService: ErrorHandlingService,
        public router: Router,
        private toastr: ToastrService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public dialogData: any
    ) {
        this.data.shipping = this.dialogData.shop.shippingCountries;
         const countries: string[] = this.dialogData.shop.countries;
         this.data.countries = countries.join();
    }

    ngOnInit() {
    }

    cancel() {
        this.close();
    }

    close() {
        this.dialogRef.close();
    }

    submit(data: Offer) {
        this.offersService.postOffer(data).subscribe(response => {
            this.unsavedChanges = false;
            this.close();
            this.toastr.success(savedMessageKey);
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error, 'offer');
                this.validationErrors = error.formErrors;
            });
    }

}
