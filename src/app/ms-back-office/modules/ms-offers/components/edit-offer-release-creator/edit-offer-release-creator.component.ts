import { Component, AfterViewInit, Inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Offer } from '../../models/offer';
import { Shop } from '../../../ms-shops/models/shops';
import { OffersService } from '../../services/offers.service';
//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedBrandMessageKey = 'Updated';

@Component({
  selector: 'edit-offer-release-creator',
  templateUrl: './edit-offer-release-creator.component.html',
  styleUrls: ['./edit-offer-release-creator.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditOfferReleaseCreatorComponent implements OnInit, AfterViewInit, CanDeactivateMixin {

  data: Offer;

  validationErrors: ValidationErrors;

  offers: Array<Offer>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard';

  saveMessageKey = 'Discard ';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  offerId: string;

  shop: Shop;

  shopToShow: Array<Shop> = [];

  constructor(
    public dialogRef: MatDialogRef<EditOfferReleaseCreatorComponent>,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public offersService: OffersService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    // setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit() {
    this.filterVirtualsShops();
    this.data = this.dialogData.data;
    this.shop = this.dialogData.shops ? this.dialogData.shops.find((shop) => shop.id === this.data.shopId) : new Shop;
  }
  ngAfterViewInit() {
    // this.getOffer();
  }

  filterVirtualsShops() {
    this.shopToShow = this.dialogData.shops.filter((element: Shop) => {
      return (element.type === 'virtual');
    });
  }

  // getOffer() {
  //   this.offersService.getOffer(this.offerId).subscribe(response => {
  //     this.data = response.data;
  //     this.shop = this.dialogData.shops ? this.dialogData.shops.find((shop) => shop.id === this.dialogData.data.shopId) : new Shop;
  //   },
  //     (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
  //   )
  // }

  submit(data: Offer) {
    if (this.dialogData.releaseId) {
      this.updateOffer(data);
    } else {
      this.dialogRef.close(data);
    }

  }

  cancel() {
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  updateOffer(data: Offer) {
    this.offersService.putOffer(data).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedBrandMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });
  }
}
