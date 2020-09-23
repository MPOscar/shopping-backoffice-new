import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ValidationErrors, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
//
import { CanDeactivateMixin } from '../../../../../ui/helpers/component-can-deactivate';
import { ConfirmDialogComponent, } from '../../../../../ui/modules/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ImagesService } from '../../../../../ui/modules/images-card/services/images.service';
import { Mixin } from '../../../../../ui/helpers/mixin-decorator';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { MainImage, Release, ReleaseImage, ReleaseResponse } from '../../models/releases';
import { ReleaseService } from '../../services/releases.service';
import { ReleaseImagesService } from '../../services/releases-images.service';
import { Brand } from '../../../ms-brands/models/brand';
import { Category } from '../../../ms-categories/models/category';
import { Collection } from '../../../ms-collections/models/collection';
import { BaseRouteComponent } from '../../../../../routing/components/base-route-component';
import { Shop } from '../../../ms-shops/models/shops';
import { Style } from '../../../ms-style/models/style';
import { OffersService } from '../../../ms-offers/services/offers.service';

const errorKey = 'Error';

const savedUserMessageKey = 'Saved User Message';

@Component({
  selector: 'new-release',
  templateUrl: './new-release.component.html',
  styleUrls: ['./new-release.component.scss']
})

@Mixin([CanDeactivateMixin])
export class NewReleaseComponent implements CanDeactivateMixin, OnInit {

  data: Release;

  brands: Array<Brand>;

  categories: Array<Category>;

  collections: Array<Collection>;

  shops: Array<Shop>;

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

  releaseId: string;

  copyReleaseId: string;

  styleId: string;

  returnUrl: string;
  // end

  validationErrors: ValidationErrors;

  //@Input() brands: Array<Brand>;TODO

  //@Output() close = new EventEmitter();TODO

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public errorHandlingService: ErrorHandlingService,
    public imagesService: ImagesService,
    public offersService: OffersService,
    public releasesService: ReleaseService,
    public releasesImagesService: ReleaseImagesService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.brands = this.activatedRoute.snapshot.data.brands;
    this.shops = this.activatedRoute.snapshot.data.shops;
    this.categories = this.activatedRoute.snapshot.data.categories;
    this.collections = this.activatedRoute.snapshot.data.collections;
    this.styles = this.activatedRoute.snapshot.data.styles;
    this.data = this.activatedRoute.snapshot.data.release;
    this.cleanCopiedRelease();

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
    this.styleId = this.activatedRoute.snapshot.queryParams['styleId'];
  }

  cleanCopiedRelease() {
    this.copyReleaseId = this.data.id;
    this.data.id = undefined;
    this.data.sku = "";
    this.data.createdAt = undefined;
    this.data.updatedAt = undefined;
    this.data.releaseDate = null;
    this.data.supplierColor = null;
    this.data.images = [];
    // if (this.data.offers) {
    //   this.data.offers.forEach(offer => {
    //     offer.releaseId = undefined;
    //     if (offer.links) {
    //       offer.links.forEach(link => {
    //         link.id = undefined;
    //         link.createdAt = undefined;
    //         link.updatedAt = undefined;
    //       });
    //     }
    //   });
    // }
  }

  submit(data: Release) {
    this.createRelease(data);
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

  createRelease(releaseData: Release) {
    let mainImageFlag = false;
    let onlyOne = false;
    let offers = releaseData.offers;
    this.releasesService.postRelease(releaseData).subscribe(response => {
      this.releaseId = response.data.id;
      this.updateReleaseOffers(offers, this.releaseId);
      releaseData.images = [];
      const imagesObservables = new Array<Observable<any>>();
      for (const position in releaseData.faces) {
        const face = releaseData.faces[position];
        if (face.mainImage === true) {
          onlyOne = true;
          mainImageFlag = true;
          this.imagesService.postImage(face.file).subscribe(response => {

            let mainImage: MainImage = {
              mainImage: response.data.url
            }

            let image = new ReleaseImage;
            image.imgUrl = response.data.url;

            this.releasesImagesService.postReleaseImage(this.releaseId, image).subscribe(response => { });

            releaseData.mainImage = response.data.url;
            releaseData.id = this.releaseId;
            this.releasesService.putRelease(releaseData).subscribe(response => {
              this.close();
            });
          },
            (error: HandledError) => {
              this.errorHandlingService.handleUiError(errorKey, error);
              this.validationErrors = error.formErrors;
            });
        } else {
          const subscription$ = this.imagesService.postImage(face.file);
          imagesObservables.push(subscription$);
        }
      }

      if (imagesObservables.length > 0) {
        onlyOne = false;
        forkJoin(imagesObservables).subscribe(responses => {
          for (const item in responses) {
            if (!mainImageFlag) {
              releaseData.mainImage = responses[item].data.url;;
              releaseData.id = this.releaseId;
              this.releasesService.putRelease(releaseData).subscribe(response => { });
              mainImageFlag = true;
            }
            //const image = responses[item].data.url;
            let image = new ReleaseImage;
            image.imgUrl = responses[item].data.url;
            releaseData.images = [...releaseData.images, image]
          }
          //this.releasesService.postRelease(releaseData).subscribe(response => {
          //send images realeases
          this.releasesImagesService.postReleaseImageAll(response.data.id, releaseData.images).subscribe(response => {
          },
            (error: HandledError) => {
              this.errorHandlingService.handleUiError(errorKey, error);
              this.validationErrors = error.formErrors;
            });
          this.unsavedChanges = false;
          this.close();
          this.toastr.success((savedUserMessageKey));

        },
          (error: HandledError) => {
            this.errorHandlingService.handleUiError(errorKey, error);
            this.validationErrors = error.formErrors;
          }
        );
      } else {
        if (!onlyOne) {
          this.close();
        }
      }
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error, 'release');
        this.validationErrors = error.formErrors;
      });

  }

  updateReleaseOffers(offers: Array<any>, releaseId) {
    if (offers) {
      offers.forEach(item => {
        delete item.id;
        item.releaseId = releaseId;
        this.offersService.postOffer(item).subscribe(response => {
        },
          (error: HandledError) => {
            this.errorHandlingService.handleUiError(errorKey, error);
            this.validationErrors = error.formErrors;
          });
      })
    }

  }

}
