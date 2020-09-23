import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//
import { TranslateService } from '@ngx-translate/core';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { Face, State } from '../../../../../ui/modules/images-card/models/face';
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Brand } from '../../models/brand';
import { BrandsService } from '../../services/brands.service';
import { LinkShopsBrandModalComponent } from '../../../ms-shops/components/link-shops-brand/link-shops-brand-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Shop } from '../../../ms-shops/models/shops';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';

const errorKey = 'Error';

@Component({
    selector: 'edit-brand-form',
    templateUrl: './edit-brand-form.component.html',
    styleUrls: ['./edit-brand-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditBrandFormComponent extends BaseReactiveFormComponent<Brand> implements OnInit {

    @Input() faceList: Array<Face> = [];

    @Input() principal: Face;

    faces: FormControl;

    @Input() brandId: string;

    linkedShops: Array<any>;

    modalRef: MatDialogRef<LinkShopsBrandModalComponent>;

    shops: Array<Shop>;

    shops2: Array<Shop>;

    displayOnBrandsCount: number = 0;

    @ViewChild('shops') fileInput: ElementRef;

    constructor(
        public activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public brandsService: BrandsService,
        private errorHandlingService: ErrorHandlingService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        translateService: TranslateService) {
        super(translateService);
        //setTranslations(this.translateService, TRANSLATIONS);TODO
    }

    ngOnInit() {
        this.shops = this.activatedRoute.snapshot.data.shops;
        this.shops2 = this.activatedRoute.snapshot.data.shops;
        let validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        this.brandsService.getBrandLinkedShops(this.brandId).subscribe(response => {
            this.linkedShops = response.data;
            this.shops2.forEach((shop) => {
                this.isLinked(shop.id);
            });
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });


        this.createFormGroup();
    }

    createFormGroup() {
        this.faces = this.formBuilder.control(this.faceList);
        this.formGroup = new FormGroup({
            faces: this.faces,
            name: new FormControl(this.data.name, [Validators.required]),
            description: new FormControl(this.data.description),
            imgUrl: new FormControl(this.data.imgUrl),
        });

    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

    linkShopsModalBrand() {
        this.modalRef = this.dialog.open(LinkShopsBrandModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                brandId: this.brandId,
                shops: this.shops,
            }
        });
        this.modalRef.afterClosed().subscribe(() => {
            this.brandsService.getBrandLinkedShops(this.brandId).subscribe(response => {
                this.linkedShops = response.data;
                this.displayOnBrandsCount = 0;
                this.shops.forEach((shop) => {
                    this.isLinked(shop.id);
                });
                this.fileInput.nativeElement.click();
            },
                (error: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, error);
                });
        });
    }

    linked(shop: Shop) {
        shop.linked = !shop.linked;
        if (shop.linked) {
            this.linkedShops = [...this.linkedShops, shop.id];
        } else {
            let indexLinked = this.linkedShops.findIndex((val) => val === shop.id);
            if (indexLinked > -1) {
                let linked: Array<string> = [];
                this.linkedShops.forEach((shopId, index) => {
                    if (index != indexLinked) {
                        linked = [...linked, shopId]
                    }
                });
                this.linkedShops = linked;
            }
        }
    }

    /* isLinked(id: string) {
         let isLinked = this.linkedShops.findIndex(shop => shop.shopId === id) > -1;
         if (isLinked) {
             let index = this.shops2.findIndex(shop => shop.id === id);
             this.shops2[index].linked = true;
             this.shops2[index].checked = true;
         } else {
             let index = this.shops2.findIndex(shop => shop.id === id);
             this.shops2[index].linked = false;
             this.shops2[index].checked = false;
         }

     }*/

     isLinked(id: string) {
        let isLinked = this.linkedShops.findIndex(shop => shop.shopId === id) > -1;
        if (isLinked) {
          let linkedShop = this.linkedShops.find(shop => shop.shopId === id);
          let index = this.shops2.findIndex(shop => shop.id === id);
          this.shops2[index].linked = true;
          this.shops2[index].checked = true;
          this.shops2[index].checkedDisplayOnBrands = linkedShop.displayOnBrands;
          this.shops2[index].displayOnBrands = linkedShop.displayOnBrands;
          if (linkedShop.displayOnBrands) {
            this.displayOnBrandsCount++;
          }
        } else {
          let index = this.shops.findIndex(shop => shop.id === id);
          this.shops2[index].linked = false;
          this.shops2[index].checked = false;
          this.shops2[index].checkedDisplayOnBrands = false;
          this.shops2[index].displayOnBrands = false;
        }
      }

    changeCollection(brandId: string) {
        this.brandId = brandId;
        this.brandsService.getBrandLinkedShops(brandId).subscribe(response => {
            this.linkedShops = response.data;
            this.shops2.forEach((shop) => {
                this.isLinked(shop.id);
            });
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });
    }

    save(remove: boolean) {
        if (remove) {
            this.linkedShops = [];
        }
        this.brandsService.postBrandLinkedShops(this.brandId, this.linkedShops).subscribe(response => {
            this.toastr.success("Saved");
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });
    }


    addThisShopToTop5Shop() {
        this.brandsService.postBrandLinkedShops(this.brandId, this.linkedShops).subscribe(response => {
            this.toastr.success("Saved");
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });
    }

    checkIfIsDisabled(shop: Shop) {
        if (shop.displayOnBrands) {
            return false;
        } else if (this.displayOnBrandsCount >= 5) {
            return true;
        }
        return false;
    }

    displayOnBrands(shop: Shop, disabled: boolean) {
        if (!disabled) {
          if (shop.displayOnBrands) {
            shop.displayOnBrands = false;
            this.displayOnBrandsCount--;
            this.linkedShops.forEach(linkedShop => {
              if (shop.id === linkedShop.shopId) {
                linkedShop.displayOnBrands = false;
              }
            });
          } else {
            shop.displayOnBrands = true;
            this.displayOnBrandsCount++;
            this.linkedShops.forEach(linkedShop => {
              if (shop.id === linkedShop.shopId) {
                linkedShop.displayOnBrands = true;
              }
            })
            if (!shop.linked) {
              this.linked(shop);
            }
          }
          this.save(false);
        }
      }
}

