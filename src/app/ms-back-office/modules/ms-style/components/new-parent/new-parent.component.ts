import { Component, Input, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Style } from '../../models/style';
import { StylesService } from '../../services/styles.service';
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';

const errorKey = 'Error';

const savedUserMessageKey = 'Saved';

@Component({
  selector: 'new-parent',
  templateUrl: './new-parent.component.html',
  styleUrls: ['./new-parent.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewParentModalComponent implements CanDeactivateMixin, OnInit {

  data: Style = {
    name: '',
    description: '',
    brand: '',
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

  // end

  validationErrors: ValidationErrors;

  // @Input() brands: Array<Brand>;TODO

  // @Output() close = new EventEmitter();TODO

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<NewParentModalComponent>,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    public router: Router,
    public stylesService: StylesService,
    private toastr: ToastrService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
  }

  ngOnInit() {
    this.brands = this.activatedRoute.snapshot.data.brands;
    this.categories = this.activatedRoute.snapshot.data.categories;
    this.styles = this.activatedRoute.snapshot.data.styles;
  }

  submit(data: Style) {
    this.createStyle(data);
  }

  cancel() {
    // this.close.emit();TODO
    this.close();
  }

  close(parentId?: string) {
    this.dialogRef.close(parentId);
}

  createStyle(data: Style) {
    data.isParent = true;
    this.stylesService.postStyle(data).subscribe(response => {
      this.unsavedChanges = false;
      this.close(response.data.id);
      this.toastr.success(savedUserMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error, 'style');
        this.validationErrors = error.formErrors;
      });
  }
}
