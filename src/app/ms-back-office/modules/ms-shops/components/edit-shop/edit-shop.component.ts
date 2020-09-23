import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { forkJoin, Observable, Subscription, pipe, of, UnaryFunction } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
//
import { Face, MainImage, State, Status } from '../../../../../ui/modules/images-card/models/face';
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Shop, ShopImage } from '../../models/shops';
import { ShopsService } from '../../services/shops.service';
import { ShopsImgesService } from '../../services/shops-images.service';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
// import { setTranslations } from '@c/ngx-translate';

import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { Release } from '../../../ms-releases/models/releases';
import { switchMap, catchError, tap, filter } from 'rxjs/operators';



const errorKey = 'Error';

const updatedShopMessageKey = 'Updated';

@Component({
  selector: 'edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.scss']
})

@Mixin([CanDeactivateMixin])
export class EditShopComponent implements AfterViewInit, CanDeactivateMixin, OnDestroy, OnInit {

  brands: Array<Brand>;

  categories: Array<Category>;

  collections: Array<Collection>;

  dealId: string;

  data: Shop;

  faceList: Array<Face> = [];

  releases: Array<Release>;

  validationErrors: ValidationErrors;

  shops: Array<Shop>;

  // Begin Mixin code of the CanDeactivate class

  unsavedChanges = false;

  cancelBtnKey = 'No';

  okBtnKey = 'Yes';

  saveTitleKey = 'Discard Title';

  saveMessageKey = 'Discard Message';

  modalRef: MatDialogRef<ConfirmDialogComponent>;

  shopId: string;

  returnUrl: string;

  canDeactivate: () => Observable<boolean> | boolean;

  dataChanged: () => void;

  subscriptions: Subscription[] = [];

  // @Output() close = new EventEmitter();

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public shopsService: ShopsService,
    private errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public shopsImgesService: ShopsImgesService,
    public router: Router,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.shopId = this.activatedRoute.snapshot.data.shopId;
    this.brands = this.activatedRoute.snapshot.data.brands;
    this.categories = this.activatedRoute.snapshot.data.categories;
    this.collections = this.activatedRoute.snapshot.data.collections;
    this.faceList = this.activatedRoute.snapshot.data.shopAllImages;
    this.shops = this.activatedRoute.snapshot.data.shops;
    this.releases = this.activatedRoute.snapshot.data.releases;

    this.dealId = this.activatedRoute.snapshot.queryParams.dealId;
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  ngAfterViewInit() {
    this.getShop();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getShop() {
    const sub = this.shopsService.getShop(this.shopId).subscribe(
      response => this.data = response.data,
      (error: HandledError) =>
        this.errorHandlingService.handleUiError(errorKey, error)
    );
    this.subscriptions.push(sub);
  }

  submit(data: Shop) {
    delete data.updatedAt;
    delete data.createdAt;
    this.editShop(data);
  }

  cancel() {
    this.close();
  }

  close() {
    if (this.returnUrl && this.returnUrl.length > 0) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, { relativeTo: this.activatedRoute });
    }
  }


  editShop(shopData: Shop) {
    if (shopData.faces) {
      this.createImages(shopData).then(() => {
        this.putShop(shopData);
      });
    } else {
      this.putShop(shopData);
    }
  }

  putShop(shopData: Shop) {
    const sub = this.shopsService.putShop(shopData).subscribe(resp => {
      this.unsavedChanges = false;
      this.close();
      this.toastr.success(updatedShopMessageKey);
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error, 'shop');
        this.validationErrors = error.formErrors;
      });
    this.subscriptions.push(sub);
  }

  createImages(shopData: Shop): Promise<void[]> {
    return Promise.all(shopData.faces.map((face: any) => {
      return new Promise((resolve: (result?: void) => void, reject: (reason?: void) => void): void => {
        if (face[0].imgUrl && !face[0].file) {
          shopData.mainImage = face[0].imgUrl;
          resolve();
        } else if (face[0].file) {
          const sub1 = this.imagesService.postImage(face[0].file).subscribe(response => {
            if (face.mainImage) {
              shopData.mainImage = response.data.url;
            } else if (face.smallImage) {
              shopData.smallImage = response.data.url;
            } else if (face.headerImage) {
              shopData.headerImage = response.data.url;
            }
            resolve();
          }, (error: HandledError) => {
            this.errorHandlingService.handleUiError(errorKey, error);
            this.validationErrors = error.formErrors;
            reject();
          });
          this.subscriptions.push(sub1);
        }
      });
    }));
  }

}
