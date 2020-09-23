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
import { Collection } from '../../models/collection';
import { CollectionsService } from '../../services/collections.service';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Collection?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';

@Component({
  selector: 'delete-collection',
  templateUrl: './delete-collection.component.html',
  styleUrls: ['./delete-collection.component.scss']
})
export class DeleteCollectionComponent implements AfterViewInit, OnInit {

  data: Collection;

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  collectionId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public collectionsService: CollectionsService,
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
    this.collectionId = this.activatedRoute.snapshot.data.collectionId;
  }

  getCollection() {
    this.collectionsService.getCollection(this.collectionId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteCollection();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  confirmDeleteCollection() {
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
        this.deleteCollection();
      } else {
        this.close();
      }
    });
  }

  deleteCollection(): void {
    this.collectionsService.deleteCollection(this.data.id).subscribe(response => {
      this.collectionsService.reloadCollections().subscribe(response => {
        this.collectionsService.collectionsList.next(response);
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

