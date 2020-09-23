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
import { Style } from '../../models/style';
import { StylesService } from '../../services/styles.service';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Style?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
  selector: 'delete-style',
  templateUrl: './delete-style.component.html',
  styleUrls: ['./delete-style.component.scss']
})
export class DeleteStyleComponent implements AfterViewInit, OnInit {

  data: Style;

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  styleId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public stylesService: StylesService,
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
    this.styleId = this.activatedRoute.snapshot.data.styleId;
  }

  getShop() {
    this.stylesService.getStyle(this.styleId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteStyle();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  confirmDeleteStyle() {
    this.modalRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titleKey: titleKey,
        okBtnKey: deleteBtnKey,
        messageKey: messageKey,
        messageParam: { param: this.data.name }
      }, panelClass: 'custom-dialog-container'
    });

    this.modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteStyle();
      } else {
        this.close();
      }
    });
  }

  deleteStyle(): void {
    this.stylesService.deleteStyle(this.data.id).subscribe(response => {
      this.stylesService.reloadStyles().subscribe(response => {
        this.stylesService.stylesList.next(response);
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
