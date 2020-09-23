import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
//
import { ConfirmDialogComponent } from '../../../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../../../error-handling/services/error-handling.service';
import { ToastrService } from '../../../../../../../error-handling/services/toastr.service';
import { HandledError } from '../../../../../../../error-handling/models/handled-error';


//import { setTranslations } from '../../../../../ngx-translate';
//import { TRANSLATIONS } from './i18n/delete-user.component.translations';
import { Link } from '../../models/urls';
import { UrlsService } from '../../services/urls.service';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Link?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
  selector: 'delete-link',
  templateUrl: './delete-link.component.html',
  styleUrls: ['./delete-link.component.scss']
})
export class DeleteLinkComponent implements AfterViewInit, OnInit {

  data: Link;

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  urlId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public urlsService: UrlsService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngAfterViewInit() {
    this.getCollection();
  }

  ngOnInit() {
    this.urlId = this.activatedRoute.snapshot.data.urlId;
  }

  getCollection() {
    this.urlsService.getUrl(this.urlId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteUrl();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  confirmDeleteUrl() {
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
        this.deleteUrl();
      } else {
        this.close();
      }
    });
  }

  deleteUrl(): void {
    this.urlsService.deleteUrl(this.data.id).subscribe(response => {
      this.urlsService.reloadUrls().subscribe(response => {
        this.urlsService.urlsList.next(response);
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


