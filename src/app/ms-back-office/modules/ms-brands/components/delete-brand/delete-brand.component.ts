import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';


import { Brand } from '../../models/brand';
import { BrandsService } from '../../services/brands.service';
import { ConfirmDialogMessageComponent } from 'src/app/ui/modules/confirm-dialog-message/components/confirm-dialog-message/confirm-dialog-message.component';
const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Brand?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';



@Component({
  selector: 'delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.scss']
})
export class DeleteBrandComponent implements AfterViewInit, OnInit {

  data: Brand;

  // modalRef: MatDialogRef<ConfirmDialogComponent>;
  modalRef: MatDialogRef<ConfirmDialogMessageComponent>;

  brandId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public brandsService: BrandsService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService) {
    // setTranslations(this.translate, TRANSLATIONS);
  }

  ngAfterViewInit() {
    this.getCollection();
  }

  ngOnInit() {
    this.brandId = this.activatedRoute.snapshot.data.brandId;
  }

  getCollection() {
    this.brandsService.getBrand(this.brandId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteBrand();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    );
  }

  close() {
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
  }


  confirmDeleteBrand() {
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
        this.deleteBrand();
      } else {
        this.close();
      }
    });
  }
  // confirmDeleteBrand() {
  //   this.modalRef = this.dialog.open(ConfirmDialogComponent, {
  //     data: {
  //       titleKey: titleKey,
  //       okBtnKey: deleteBtnKey,
  //       messageKey: messageKey,
  //       messageParam: { param: this.data.name }
  //     }
  //   });

  //   this.modalRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.deleteBrand();
  //     } else {
  //       this.close();
  //     }
  //   });
  // }

  deleteBrand(): void {
    this.brandsService.deleteBrand(this.data.id).subscribe(response => {
      this.brandsService.reloadBrands().subscribe(response => {
        this.brandsService.brandsList.next(response);
        this.toastr.success(deletedMessageKey);
        this.close();
      },
        (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.close();
      }
    );
  }
}



