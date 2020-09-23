import { Component, OnInit, Inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Offer } from '../../models/offer';
import { OffersService } from '../../services/offers.service';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';


const errorKey = 'Error';

const savedMessageKey = 'Saved';

const addOfferMessage = 'You must add at least one offer'

@Component({
  selector: 'new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewOfferComponent implements CanDeactivateMixin, OnInit {

  offerList: Array<Offer> = [];

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
    public dialogRef: MatDialogRef<NewOfferComponent>,
    public activatedRoute: ActivatedRoute,
    public offersService: OffersService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
  }

  ngOnInit() {
    this.filterVirtualsShops();
    this.shops = this.dialogData.shops;
    this.releases = this.dialogData.releases;
  }

  filterVirtualsShops() {
    this.shopToShow = this.dialogData.shops.filter((element: Shop) => {
      return (element.type === 'virtual' || element.isParent);
    });
  }

  submit(offerList: Offer[]) {
    this.createOffer(offerList);
  }

  cancel() {
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  // createOffer(data: Offer[]) {
  //   this.offersService.postOffer(data).subscribe(response => {
  //     this.unsavedChanges = false;
  //     this.close();
  //     this.toastr.success(savedMessageKey);
  //   },
  //     (error: HandledError) => {
  //       this.errorHandlingService.handleUiError(errorKey, error, 'offer');
  //       this.validationErrors = error.formErrors;
  //     });
  // }

  createOffer(offerList: Offer[]) {
    if (offerList.length) {
      this.offersService.postOffers(offerList).subscribe(response => {
        this.unsavedChanges = false;
        this.close();
        this.toastr.success(savedMessageKey);
      },
        (error: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, error, 'offer');
          this.validationErrors = error.formErrors;
        });
    } else {
      this.toastr.error(addOfferMessage, errorKey);
    }
  }

}
