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
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';

const titleKey = 'Delete';

const deleteBtnKey = 'Delete';

const messageKey = 'Are you sure you want to delete this Category?';

const errorKey = 'Error';

const deletedMessageKey = 'Deleted';


@Component({
  selector: 'delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.scss']
})
export class DeleteCategoryComponent implements AfterViewInit, OnInit {

  data: Category;

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  categoryId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    public categoriesService: CategoriesService,
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
    this.categoryId = this.activatedRoute.snapshot.data.categoryId;
  }

  getCollection() {
    this.categoriesService.getCategory(this.categoryId).subscribe(response => {
      this.data = response.data;
      this.confirmDeleteCategory();
    },
      (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error)
    )
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  confirmDeleteCategory() {
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
        this.deleteCategory();
      } else {
        this.close();
      }
    });
  }

  deleteCategory(): void {
    this.categoriesService.deleteCategory(this.data.id).subscribe(response => {
      this.categoriesService.reloadCategories().subscribe(response => {
        this.categoriesService.categoriesList.next(response);
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


