import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable, Subscription, iif, pipe, of } from 'rxjs';
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
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';
import { Face, State } from 'src/app/ui/modules/images-card/models/face';
import { ImagesService } from 'src/app/ui/modules/images-card/services/images.service';
import { switchMap, catchError, tap } from 'rxjs/operators';
//import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedMessageKey = 'Updated';

@Component({
    selector: 'edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditCategoryComponent implements AfterViewInit, CanDeactivateMixin, OnDestroy {

    data: Category;

    validationErrors: ValidationErrors;

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

    categoryId: string;

    faceList: Array<Face> = [];

    principal: Face;
    subscriptions: Subscription[] = [];

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public categoriesService: CategoriesService,
        private errorHandlingService: ErrorHandlingService,
        private router: Router,
        private imagesService: ImagesService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.categoryId = this.activatedRoute.snapshot.data.categoryId;
    }
    ngAfterViewInit() {
        this.getCategory();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    getCategory() {
        const sub = this.categoriesService.getCategory(this.categoryId).subscribe(
            response => {
                this.data = response.data;
                if (this.data.imgUrl) {
                    let face: Face = {
                        imgUrl: this.data.imgUrl
                    };
                    this.faceList = [face];
                    this.principal = face;
                }
            },
            (error: HandledError) =>
                this.errorHandlingService.handleUiError(errorKey, error)
        );

        this.subscriptions.push(sub);
    }

    submit(data: Category) {
        delete data.updatedAt;
        delete data.createdAt;
        this.updateCategory(data);
    }

    cancel() {
        this.close();
    }

    close() {
        this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
    }

    updateCategory(data: Category) {
        if (data.faces && data.faces.length > 0) {
            const face = data.faces[0];
            if (face.state === State.New) {
                const sub = this.imagesService.postImage(face.file).pipe(
                    switchMap(response => {
                        data.imgUrl = response.data.url;
                        return this.categoriesService.putCategory(data).pipe(
                            catchError((error: HandledError) => {
                                this.errorHandlingService.handleUiError(errorKey, error);
                                this.validationErrors = error.formErrors;
                                return of(null);
                            })
                        );
                    }),
                    catchError((error: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, error);
                        this.validationErrors = error.formErrors;
                        return of(null);
                    }),
                    tap((category) => {
                        if (category) {
                            this.unsavedChanges = false;
                            this.close();
                            this.toastr.success(updatedMessageKey);
                        }
                    })
                ).subscribe();

                this.subscriptions.push(sub);
            } else {
                this.putCategory(data);
            }

        } else {
            this.putCategory(data);
        }
    }

    putCategory(data: Category) {
        const sub = this.categoriesService.putCategory(data).subscribe(
            () => {
                this.unsavedChanges = false;
                this.close();
                this.toastr.success(updatedMessageKey);
            },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
                this.validationErrors = error.formErrors;
            }
        );

        this.subscriptions.push(sub);
    }


}
