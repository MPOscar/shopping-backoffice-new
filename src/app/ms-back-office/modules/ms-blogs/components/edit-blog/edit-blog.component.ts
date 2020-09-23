import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Observable, Subscription, pipe, of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
//
import { Blog } from '../../models/blog';
import { BlogsImgesService } from '../../services/blogs-images.service';
import { BlogsService } from '../../services/blogs.service';
import { Brand } from '../../../ms-brands/models/brand';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { ReleaseImage } from '../../../ms-releases/models/releases';
import { catchError, map, switchMap, tap, filter } from 'rxjs/operators';

// import { setTranslations } from '@c/ngx-translate';

const errorKey = 'Error';

const updatedBlogMessageKey = 'Updated';

const savedCaseMessageKey = 'Saved Changes';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditBlogComponent implements OnInit, AfterViewInit, CanDeactivateMixin, OnDestroy {

  data: Blog;

  validationErrors: ValidationErrors;

  blogs: Array<Blog>;

  brands: Array<Brand>;

  // Begin Mixin code of the CanDeactivate class
  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  faceList: Array<Face> = [];

  imageList: ReleaseImage[];

  principal: Face;

  blogId: string;

  subscriptions: Subscription[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public blogsImgesService: BlogsImgesService,
    public dialog: MatDialog,
    public blogsService: BlogsService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService) {
    // setTranslations(this.translate, TRANSLATIONS);
  }

  ngOnInit() {
    this.blogId = this.activatedRoute.snapshot.data.blogId;
    this.brands = this.activatedRoute.snapshot.data.brands;
    this.imageList = this.activatedRoute.snapshot.data.blogAllImages;
  }

  ngAfterViewInit() {
    this.getBlog();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  getBlog() {
    const sub = this.blogsService
      .getBlog(this.blogId)
      .subscribe(
        response => {
          this.data = response.data;
          if (this.data.imgUrl) {
            this.imageList.forEach(image => {
              image.fileName = '';
              if (image.imgUrl === this.data.imgUrl) {
                image.mainImage = true;
                this.principal = image;
              }
            });
          }

          this.data.faces = this.imageList;
        },
        (error: HandledError) =>
          this.errorHandlingService.handleUiError(errorKey, error)
      );

    this.subscriptions.push(sub);
  }

  submit(data: Blog) {
    this.updateBlogCase(data);
  }

  cancel() {
    this.close();
  }

  close() {
    this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
  }



  updateBlogCase(blogData: Blog) {
    if (blogData !== undefined && blogData !== null) {
      const commonErrorHandlingPipe = pipe(
        catchError((error: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, error);
          this.validationErrors = error.formErrors;
          return of(null);
        })
      );

      const afterSavePipe = pipe(
        // if response is not null it means no error has been caught,
        // otherwise that would have been handled in the commonErrorHandlingPipe
        // so we can filter out null values
        filter(success => !!success),
        switchMap(() => {
          this.unsavedChanges = false;
          this.close();
          return this.translate.get(savedCaseMessageKey);
        }),
        tap(value => {
          this.toastr.success(value);
        })
      );
      let subscription$: Subscription = null;

      if (blogData.faces.length > 0) {
        // create an observable array with all the
        // blog images that need to be uploaded
        const newImagesObservables$ = blogData.faces
          // only use 'New' images
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
              commonErrorHandlingPipe
            );
          });

        if (newImagesObservables$.length > 0) {
          subscription$ = forkJoin(newImagesObservables$).pipe(
            switchMap(savedImages => {
              const mainImage = savedImages.find(i => i.mainImg);
              const mainImageLast = this.imageList.find(i => i.mainImage);
              const updateBlog$ = this.blogsService.putBlog({
                ...blogData,
                imgUrl: mainImage ? mainImage.url : mainImageLast.imgUrl // update main image
              }).pipe(commonErrorHandlingPipe);

              const oldImages: any[] = blogData.faces
                .filter(f => f.state !== State.New)
                .map(f => {
                  // remove 'id' property, that's used to track on the form, from the items
                  const { id, ...rest } = f;
                  return rest;
                })
                .map(f => ({ ...f, state: 'old' }));

              const newSavedImages = savedImages.filter(img => img); // filter out possible nulls from the error handling

              const updateAllBlogImages$ = this.blogsImgesService
                .postReleaseImageAll(
                  this.blogId,
                  [...oldImages, ...newSavedImages]
                ).pipe(commonErrorHandlingPipe);

              return forkJoin([updateBlog$, updateAllBlogImages$]);
            }),
            afterSavePipe
          )
            .subscribe();
        } else {
          const mainImage = blogData.faces.find(i => i.mainImage);
          subscription$ = this.blogsService.putBlog({
            ...blogData,
            imgUrl: mainImage ? mainImage.imgUrl : ''// update main image
          })
            .pipe(
              commonErrorHandlingPipe,
              afterSavePipe,
            )
            .subscribe();
        }
      } else {
        subscription$ = this.blogsService.putBlog(blogData)
          .pipe(
            commonErrorHandlingPipe,
            afterSavePipe,
          )
          .subscribe();
      }

      this.subscriptions.push(subscription$);
    }

  }
}
