import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Style } from '../../models/style';
import { StylesService } from '../../services/styles.service';
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Shop } from '../../../ms-shops/models/shops';
//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedGroupMessageKey = 'Updated';

@Component({
  selector: 'edit-style',
  templateUrl: './edit-style.component.html',
  styleUrls: ['./edit-style.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditStyleComponent implements AfterViewInit, CanDeactivateMixin {

  brands: Array<Brand>;

  categories: Array<Category>;

  styles: Array<Style>;

  data: Style;

  validationErrors: ValidationErrors;

  groups: Array<Style>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  styleId: string;

  shops: Array<Shop>;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public stylesService: StylesService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService) {
    //setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit(){
    this.styleId = this.activatedRoute.snapshot.data.styleId;
    this.brands = this.activatedRoute.snapshot.data.brands;
    this.categories = this.activatedRoute.snapshot.data.categories;
    this.styles = this.activatedRoute.snapshot.data.styles;
    this.shops = this.activatedRoute.snapshot.data.shops;
  }
  ngAfterViewInit() {
    this.getStyle();
  }

  getStyle() {
    this.stylesService.getStyle(this.styleId).subscribe(response => {
      this.data = response.data;
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  submit(data: Style) {
    delete data.updatedAt;
    delete data.createdAt;
    this.updateStyle(data);
  }

  cancel() {
    this.close();
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  updateStyle(data: Style) {
    this.stylesService.putStyle(data).subscribe(response => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedGroupMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
      });
  }
}
