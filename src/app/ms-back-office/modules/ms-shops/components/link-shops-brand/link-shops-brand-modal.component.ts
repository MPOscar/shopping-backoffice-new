import { AfterViewInit, Component, Inject, OnInit, } from '@angular/core';
//
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
//import { setTranslations } from '@cognitec/ngx-translate';
//import { TRANSLATIONS } from './i18n/annotation-tool-modal.component.translations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { Shop } from '../../models/shops';
//import { Landmarks } from '../../models/landmarks';
import { ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
//
import { BrandsService } from '../../../ms-brands/services/brands.service';

const errorKey = 'Error';

@Component({
  selector: 'link-shops-brand-modal',
  templateUrl: './link-shops-brand-modal.component.html',
  styleUrls: ['./link-shops-brand-modal.component.css'],
})

export class LinkShopsBrandModalComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'checkbox',
    'text',
    'url',
    'actions'
  ];

  links: any[];

  answer = false;

  flag: boolean = true;

  imageSrc: any = null;

  shops: Array<Shop>;

  linkedShops: Array<any> = [];

  oldLinkedShops: Array<string> = [];

  displayOnBrandsCount: number = 0;

  constructor(element: ElementRef,
    breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<LinkShopsBrandModalComponent>,
    public errorHandlingService: ErrorHandlingService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    public brandsService: BrandsService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    //setTranslations(this.translateService, TRANSLATIONS);
    breakpointObserver.observe([
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {

      }
    });
  }

  ngOnInit() {
    this.brandsService.getBrandLinkedShops(this.dialogData.brandId).subscribe(response => {
      this.linkedShops = response.data;
      this.dialogData.shops.forEach((shop) => {
        this.isLinked(shop.id);
      });
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
      });

  }

  ngAfterViewInit() {
  }

  onAccept() {
    this.answer = true;
    this.close();
  }

  onCancel() {
    this.answer = false;
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.close();
  }

  linked(shop: Shop) {
    shop.linked = !shop.linked;
    if (shop.linked) {
      let item = {
        shopId: shop.id,
        displayOnBrands: shop.displayOnBrands,
      }
      this.linkedShops = [...this.linkedShops, item];
    } else {
      let indexLinked = this.linkedShops.findIndex((item) => item.shopId === shop.id);
      if (indexLinked > -1) {
        let linkedShop = this.linkedShops.find(item => item.shopId === shop.id);
        if (linkedShop.displayOnBrands) {
          shop.checkedDisplayOnBrands = false;
          shop.displayOnBrands = false;
          this.displayOnBrandsCount--;
        }
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

  save() {
    this.brandsService.postBrandLinkedShops(this.dialogData.brandId, this.linkedShops).subscribe(response => {
      this.close();
      this.toastr.success("Saved");
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
      });
  }

  isLinked(id: string) {
    let isLinked = this.linkedShops.findIndex(shop => shop.shopId === id) > -1;
    if (isLinked) {
      let linkedShop = this.linkedShops.find(shop => shop.shopId === id);
      let index = this.dialogData.shops.findIndex(shop => shop.id === id);
      this.dialogData.shops[index].linked = true;
      this.dialogData.shops[index].checked = true;
      this.dialogData.shops[index].checkedDisplayOnBrands = linkedShop.displayOnBrands;
      this.dialogData.shops[index].displayOnBrands = linkedShop.displayOnBrands;
      if (linkedShop.displayOnBrands) {
        this.displayOnBrandsCount++;
      }
    } else {
      let index = this.dialogData.shops.findIndex(shop => shop.id === id);
      this.dialogData.shops[index].linked = false;
      this.dialogData.shops[index].checked = false;
      this.dialogData.shops[index].checkedDisplayOnBrands = false;
      this.dialogData.shops[index].displayOnBrands = false;
    }
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
    }
  }

  checkIfIsDisabled(shop: Shop) {
    if (shop.displayOnBrands) {
      return false;
    } else if (this.displayOnBrandsCount >= 5) {
      return true;
    }
    return false;
  }

  checkIfShopIsLinked(shop: Shop) {
    let indexLinked = this.linkedShops.findIndex((item) => item.shopId === shop.id);
    if (indexLinked > -1) {
      return true;
    }
    return false;
  }
}
