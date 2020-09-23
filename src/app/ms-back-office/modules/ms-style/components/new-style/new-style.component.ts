import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { Style } from '../../models/style';
import { Shop } from '../../../ms-shops/models/shops';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { StylesService } from '../../services/styles.service';
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';

const errorKey = 'Error';

const savedUserMessageKey = 'Saved';

@Component({
  selector: 'new-style',
  templateUrl: './new-style.component.html',
  styleUrls: ['./new-style.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewStyleComponent implements CanDeactivateMixin, OnInit {

  data: Style = {
    name: "",
    description: "",
    brand: "",
    categories: [],
  };

  brands: Array<Brand>;

  categories: Array<Category>;

  styles: Array<Style>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  shops: Array<Shop>;
  // end

  validationErrors: ValidationErrors;

  //@Input() brands: Array<Brand>;TODO

  //@Output() close = new EventEmitter();TODO

  constructor(
    public activatedRoute: ActivatedRoute,
    public stylesService: StylesService,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.brands = this.activatedRoute.snapshot.data.brands;
    this.categories = this.activatedRoute.snapshot.data.categories;
    this.styles = this.activatedRoute.snapshot.data.styles;
    this.shops = this.activatedRoute.snapshot.data.shops;
  }

  submit(data: Style) {
    this.createStyle(data);
  }

  cancel() {
    //this.close.emit();TODO
    this.close();
  }

  close() {
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
  }

  createStyle(data: Style) {
    this.stylesService.postStyle(data).subscribe(response => {
      this.unsavedChanges = false;

      this.stylesService.postStyleLinkedShops(response.data.id, data.linkedShops).subscribe(response => {
      },
        (error: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, error);
        });

      if (!data.createRelease) {
        this.close();
      } else {
        this.router.navigate(['../../releases/create'], { relativeTo: this.activatedRoute, queryParams: { styleId: response.data.id } });
      }

      this.toastr.success(savedUserMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error, 'style');
        this.validationErrors = error.formErrors;
      });
  }
}
