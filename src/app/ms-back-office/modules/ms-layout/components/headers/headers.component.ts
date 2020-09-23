import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//
import { LayoutService } from '../../services/layout.service';
import { Face, MainImage, State, Status } from '../../../../../ui/modules/images-card/models/face';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
import { Header } from '../../models/layout';

const errorKey = 'Error';

const updatedBrandMessageKey = 'Updated';

@Component({
  selector: 'headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})

@Mixin([CanDeactivateMixin])
export class HeadersComponent implements CanDeactivateMixin, OnInit {

  @Input() pageId: string;

  data: Header;

  validationErrors: ValidationErrors;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard';

  saveMessageKey = 'Discard ';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  faceList: Array<Face> = [];

  principal: Face;

  brandId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public layoutService: LayoutService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getHeader();
  }

  getHeader() {
    this.layoutService.getHeader(this.pageId).subscribe(response => {
      this.data = response.data;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }
  submit(data: Header) {
    this.updateBrand(data);
  }

  updateBrand(headerData: Header) {
    if (headerData.images) {
      for (const face of headerData.images) {
        // const face = headerData.images[position];
        if (face.state === State.New) {
          this.imagesService.postImage(face.file).subscribe(response => {
            headerData.imgUrl = response.data.url;
            this.layoutService.putHeader(this.pageId, headerData).subscribe(response => {
              this.unsavedChanges = false;
              this.toastr.success(updatedBrandMessageKey);
            },
              (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
                this.validationErrors = error.formErrors;
              });
          },
            (error: HandledError) => {
              this.errorHandlingService.handleUiError(errorKey, error);
              this.validationErrors = error.formErrors;
            });
        } else {
          this.layoutService.putHeader(this.pageId, headerData).subscribe(response => {
            this.unsavedChanges = false;
            this.toastr.success(updatedBrandMessageKey);
          },
            (error: HandledError) => {
              this.errorHandlingService.handleUiError(errorKey, error);
              this.validationErrors = error.formErrors;
            });
        }
      }
    } else {
      this.layoutService.putHeader(this.pageId, headerData).subscribe(response => {
        this.unsavedChanges = false;
        this.toastr.success(updatedBrandMessageKey);
      },
        (error: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, error);
          this.validationErrors = error.formErrors;
        });
    }
  }
}
