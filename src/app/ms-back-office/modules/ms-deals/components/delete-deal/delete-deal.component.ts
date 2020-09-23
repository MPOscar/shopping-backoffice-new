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
import { Deal } from '../../models/deal';
import { DealsService } from '../../services/deals.service';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Deal?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
  selector: 'delete-deal',
  templateUrl: './delete-deal.component.html',
  styleUrls: ['./delete-deal.component.scss']
})
export class DeleteDealComponent implements AfterViewInit, OnInit {

  data: Deal;

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  dealId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public dealsService: DealsService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngAfterViewInit() {
    this.getDeal();
  }

  ngOnInit() {
    this.dealId = this.activatedRoute.snapshot.data.dealId;
  }

  getDeal() {
    this.dealsService.getDeal(this.dealId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteDeal();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  confirmDeleteDeal() {
    this.modalRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titleKey: titleKey,
        okBtnKey: deleteBtnKey,
        messageKey: messageKey,
        messageParam: { param: this.data.id }
      }
    });

    this.modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDeal();
      } else {
        this.close();
      }
    });
  }

  deleteDeal(): void {
    this.dealsService.deleteDeal(this.data.id).subscribe(response => {
      this.dealsService.reloadDeals().subscribe(response => {
        this.dealsService.dealsList.next(response);
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



