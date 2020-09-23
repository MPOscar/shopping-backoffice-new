import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, pipe, of, UnaryFunction } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
//
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';
import { Blog } from '../../models/blog';
import { BlogsService } from '../../services/blogs.service';
import { BlogsImgesService } from '../../services/blogs-images.service';
import { Brand } from '../../../ms-brands/models/brand';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
import { Face, MainImage, State, Status } from '../../../../../ui/modules/images-card/models/face';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Release, ReleaseImage } from '../../../ms-releases/models/releases';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

const errorKey = 'Error';

const savedMessageKey = 'Saved';

@Component({
  selector: 'new-blog',
  templateUrl: './new-blog.component.html',
  styleUrls: ['./new-blog.component.scss']
})
@Mixin([CanDeactivateMixin])
export class NewBlogComponent implements CanDeactivateMixin, OnInit, OnDestroy {

  data: any = {
    name: '',
    type: 'Article'
  };

  blogId: string;

  brands: Array<Brand>;

  categories: Array<Blog>;

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

  subscriptions: Subscription[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public blogsImgesService: BlogsImgesService,
    public blogsService: BlogsService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.brands = this.activatedRoute.snapshot.data.brands;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  submit(data: Blog) {
    this.createBlogCase(data);
  }

  cancel() {
    this.close();
  }

  close() {
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
  }

  createBlogCase(blogData: Blog) {

    const commonErrorHandling = pipe(
      catchError((error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
        this.validationErrors = error.formErrors;
        return of(null);
      })
    );

    const blogErrorHandling = pipe(
      catchError((error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error, 'release');
        this.validationErrors = error.formErrors;
        return of(null);
      })
    );

      // create an observable array with all the
      // blog images that need to be uploaded
      const postImgObservables$ = blogData.faces
      .filter(f => f.state === State.New)
      .map(f => {
          return this.imagesService.postImage(f.file).pipe(
              // for every response we get from the server
              // add the position field from the original
              // image that came from the form
              map(response => ({
                  position: f.position,
                  mainImg: f.mainImage,
                  state: 'new',
                  imgUrl: response.data.url,
                  url: response.data.url
              })),
              commonErrorHandling
          );
      });

    // create the blog
    const sub = this.blogsService.postBlog(blogData)
      .pipe(
        switchMap(response => {
          // get a hold of the id for later usage
          this.blogId = response.data.id;

          // trigger all img upload requests
          if (postImgObservables$.length === 0) {
            this.successBlogCreation();
          }
          return forkJoin(postImgObservables$);
        }),
        switchMap((savedImages) => {
          // handle main blog image
          let mainImage = savedImages.find(i => i.mainImg);
          if (!mainImage) {
            mainImage = savedImages[0];
          }
          const updateMainImage$ = this.blogsService
            .putBlog({ id: this.blogId, ...blogData, imgUrl: mainImage.url })
            .pipe(blogErrorHandling);

          // update blog with all images
          const updateAllImages$ = this.blogsImgesService
            .postReleaseImageAll(
              this.blogId,
              savedImages.filter(img => img) // filter out possible nulls from the error handling
            ).pipe(commonErrorHandling);

          return forkJoin([updateMainImage$, updateAllImages$]);
        }),
        blogErrorHandling,
        tap(success => {
          if (success) {
            this.successBlogCreation();
          }
        })
      ).subscribe();

    this.subscriptions.push(sub);

  }

  successBlogCreation() {
    this.unsavedChanges = false;
    this.close();
    this.toastr.success(savedMessageKey);
  }

}
