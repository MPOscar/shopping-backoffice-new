import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ConfirmDialogMessageComponent } from '../../../../../ui/modules/confirm-dialog-message/components/confirm-dialog-message/confirm-dialog-message.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';


//import { setTranslations } from '../../../../../ngx-translate';
//import { TRANSLATIONS } from './i18n/delete-user.component.translations';
import { Shop } from '../../models/shops';
import { ShopsService } from '../../services/shops.service';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Shop?<br><br> Note that all linked offers will be deleted too.<br><br>';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
  selector: 'delete-shop',
  templateUrl: './delete-shop.component.html',
  styleUrls: ['./delete-shop.component.scss']
})
export class DeleteShopComponent implements AfterViewInit, OnInit {

  data: Shop;

  modalRef: MatDialogRef<ConfirmDialogMessageComponent>;

  shopId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public shopsService: ShopsService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngAfterViewInit() {
    this.getShop();
  }

  ngOnInit() {
    this.shopId = this.activatedRoute.snapshot.data.shopId;
  }

  getShop() {
    this.shopsService.getShop(this.shopId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteShop();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  confirmDeleteShop() {
    this.modalRef = this.dialog.open(ConfirmDialogMessageComponent, {
      data: {
        titleKey: titleKey,
        okBtnKey: deleteBtnKey,
        messageKey: messageKey,
        messageParam: { param: this.data.name }
      }
    });

    this.modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteShop();
      } else {
        this.close();
      }
    });
  }

  deleteShop(): void {
    this.shopsService.deleteShop(this.data.id).subscribe(response => {
      this.shopsService.reloadShops().subscribe(response => {
        this.shopsService.shopsList.next(response);
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
