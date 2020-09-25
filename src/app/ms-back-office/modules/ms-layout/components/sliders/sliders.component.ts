import { Component, AfterViewInit, Inject, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//

import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Release } from '../../../ms-releases/models/releases';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';
//
import { Face, State, Status } from '../../../../../ui/modules/images-card/models/face';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { FilterItem } from '../../models/filters';
import { OurPartner } from '../../models/layout';
import { LayoutService } from '../../services/layout.service';
import { HeadingFormComponent } from '../heading-form/heading-form.component';
import { Deal } from '../../../ms-deals/models/deal';
import { Offer } from '../../../ms-offers/models/offer';
// import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedMessageKey = 'Updated';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})

@Mixin([CanDeactivateMixin])
export class SlidersComponent implements AfterViewInit, CanDeactivateMixin {

  data: Array<OurPartner>;

  validationErrors: ValidationErrors;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  urlId: string;

  @Input() filters: any;

  @Input() pageId: string;

  @Input() brands: Array<Brand>;

  @Input() categories: Array<Category>;

  @Input() collections: Array<Collection>;

  @Input() deals: Array<Deal>;

  @Input() offers: Array<Offer>;

  @Input() releases: Array<Release>;

  @Input() shops: Array<Shop>;

  @Input() styles: Array<Style>;

  @ViewChild(HeadingFormComponent) headingFormComponent;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private imagesService: ImagesService,
    public layoutService: LayoutService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService,
  ) {
    // setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit() {
    this.getSlider();
  }

  getSlider() {
    this.layoutService.getSliders(this.pageId).subscribe(response => {
      this.data = response.data;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  ngAfterViewInit() {
  }

  submit(data: any) {
    this.createUpdateSlider(data);
  }

  cancel() {
    this.close();
  }

  close() {
  }

  createUpdateSlider(data: any) {
    data.slides.forEach(element => {
      delete element.id;
    });
    this.data = null;
    this.layoutService.putSliders(this.pageId, data).subscribe(response => {
      this.data = response.data;
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedMessageKey);
      this.getSlider();
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });
  }

}

