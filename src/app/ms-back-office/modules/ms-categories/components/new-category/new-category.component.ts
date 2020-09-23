import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';
import { ImagesService } from 'src/app/ui/modules/images-card/services/images.service';
import { switchMap, tap, catchError } from 'rxjs/operators';

const errorKey = 'Error';

const savedMessageKey = 'Saved';

@Component({
  selector: 'new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewCategoryComponent implements CanDeactivateMixin, OnDestroy {

  data: any = {
    name: "",
  };


  categories: Array<Category>;

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

  subscriptions: Subscription[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private errorHandlingService: ErrorHandlingService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private imagesService: ImagesService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  submit(data: Category) {
    this.createCategory(data);
  }

  cancel() {
    //this.close.emit();TODO
    this.close();
  }

  close(){
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
  }

  createCategory(data: Category) {
    if (data.faces && data.faces.length > 0) {
      // save image
      const sub = this.imagesService.postImage(data.faces[0].file).pipe(
        // update the category payload and send the req to create the category
        switchMap(res => {
          data.imgUrl = res.data.url;
          return this.categoriesService.postCategory(data).pipe(
            // handle category creation err
            catchError((error: HandledError) => {
              this.errorHandlingService.handleUiError(
                  errorKey,
                  error,
                  'category'
              );
              this.validationErrors = error.formErrors;
              return of(null);
            })
          )
        }),
        // handle img upload err
        catchError((error: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, error);
          this.validationErrors = error.formErrors;
          return of(null);
        }),
        tap(category => {
          if (category) {
            this.unsavedChanges = false;
            this.close();
            this.toastr.success(savedMessageKey);
          }
        })
      ).subscribe()

      this.subscriptions.push(sub)

    } else {
      const sub = this.categoriesService.postCategory(data).subscribe(
          () => {
              this.unsavedChanges = false;
              this.close();
              this.toastr.success(savedMessageKey);
          },
          (error: HandledError) => {
              this.errorHandlingService.handleUiError(
                  errorKey,
                  error,
                  'category'
              );
              this.validationErrors = error.formErrors;
          }
      );
      this.subscriptions.push(sub)
    }
  }

}
