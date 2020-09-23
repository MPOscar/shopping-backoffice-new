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
import { Release } from '../../models/releases';
import { ReleaseService } from '../../services/releases.service';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Release?<br><br> Note that all linked offers will be deleted too.<br><br>';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
  selector: 'delete-release',
  templateUrl: './delete-release.component.html',
  styleUrls: ['./delete-release.component.scss']
})
export class DeleteReleaseComponent implements AfterViewInit, OnInit {

  data: Release;

  modalRef: MatDialogRef<ConfirmDialogMessageComponent>;

  releaseId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public releasesService: ReleaseService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngAfterViewInit() {
    this.getRelease();
  }

  ngOnInit() {
    this.releaseId = this.activatedRoute.snapshot.data.releaseId;
  }

  getRelease() {
    this.releasesService.getRelease(this.releaseId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteRelease();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  confirmDeleteRelease() {
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
        this.deleteRelease();
      } else {
        this.close();
      }
    });
  }

  deleteRelease(): void {
    this.releasesService.deleteRelease(this.data.id).subscribe(response => {
      this.releasesService.reloadReleases().subscribe(response => {
        this.releasesService.releasesList.next(response);
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

