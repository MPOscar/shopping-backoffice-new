import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';


//import { setTranslations } from '../../../../../ngx-translate';
//import { TRANSLATIONS } from './i18n/delete-user.component.translations';
import { Offer } from '../../models/offer';
import { OffersService } from '../../services/offers.service';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Offer?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
  selector: 'delete-offer',
  templateUrl: './delete-offer.component.html',
  styleUrls: ['./delete-offer.component.scss']
})
export class DeleteOfferComponent implements AfterViewInit, OnInit {

  data: Offer;

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  offerId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public offersService: OffersService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngAfterViewInit() {
    this.getOffer(this.offerId);
  }

  ngOnInit() {
    this.offerId = this.activatedRoute.snapshot.data.OfferId;
  }

  getOffer(offerId: string) {
    this.offersService.getOffer(this.offerId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteOffer();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  confirmDeleteOffer() {
    this.modalRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titleKey: titleKey,
        okBtnKey: deleteBtnKey,
        messageKey: messageKey,
        messageParam: { param: this.data.name }
      }
    });

    this.modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOffer();
      } else {
        this.close();
      }
    });
  }

  deleteOffer(): void {
    this.offersService.deleteOffer(this.data.id).subscribe(response => {
      this.offersService.reloadOffers().subscribe(response => {
        this.offersService.offersList.next(response);
        this.toastr.success(deletedMessageKey);
        this.close();
      },
        (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.close();
      }
    )
  }
}



