import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

//
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
//import { setTranslations } from '@cognitec/ngx-translate';
//import { TRANSLATIONS } from './i18n/annotation-tool-modal.component.translations';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { Shop } from '../../models/shops';
//import { Landmarks } from '../../models/landmarks';
import { ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
//
import { NewShopModalComponent } from '../new-shop-modal/new-shop-modal.component';
import { StylesService } from '../../../ms-style/services/styles.service';
import { ShopsService } from '../../services/shops.service';
import { EditLinkComponent } from '../../../ms-links/components/edit-link/edit-link.component';

const errorKey = 'Error';

@Component({
  selector: 'shops-selling-style-modal',
  templateUrl: './shops-selling-style-modal.component.html',
  styleUrls: ['./shops-selling-style-modal.component.css'],
})

export class ShopsSellingStyleModalComponent implements OnInit, AfterViewInit {

  answer = false;

  modalRef: MatDialogRef<NewShopModalComponent | EditLinkComponent>;

  linkedShops: Array<any> = [];

  shops: Array<Shop>;

  selectedShop: any;

  thereIsAselectedShop: boolean = false;

  linkText = new FormControl();

  linkUrl = new FormControl();

  @Output() sendLinkedShops: EventEmitter<any> = new EventEmitter();

  constructor(element: ElementRef,
    breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ShopsSellingStyleModalComponent>,
    public errorHandlingService: ErrorHandlingService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    public shopsService: ShopsService,
    public stylesService: StylesService,
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
    if (this.dialogData.styleId) {
      this.stylesService.getStyleLinkedShops(this.dialogData.styleId).subscribe(response => {
        this.linkedShops = response.data;
        this.dialogData.shops.forEach((shop) => {
          this.isLinked(shop.id);
        });
      },
        (error: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, error);
        });
    } else if (this.dialogData.linkedShops) {
      this.linkedShops = this.dialogData.linkedShops;
      this.dialogData.shops.forEach((shop) => {
        this.isLinked(shop.id);
      });
    }
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
        linkUrl: "",
        textUrl: "",
      }
      this.linkedShops = [...this.linkedShops, item];

    } else {
      let indexLinked = this.linkedShops.findIndex((item) => item.shopId === shop.id);
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
    this.linkText.setValue("");
    this.linkUrl.setValue("");
  }

  save() {
    if (this.dialogData.styleId) {
      this.stylesService.postStyleLinkedShops(this.dialogData.styleId, this.linkedShops).subscribe(response => {
        this.close();
        this.toastr.success("Saved");
      },
        (error: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, error);
        });
    } else {
      this.dialogRef.close(this.linkedShops);
    }

  }

  showAddShopModal() {
    this.modalRef = this.dialog.open(NewShopModalComponent, {
      height: '90%',
      width: '90%',
      data: {
        brands: this.dialogData.brands,
        categories: this.dialogData.categories,
        shops: this.dialogData.shops,
      }
    });

    this.modalRef.afterClosed().subscribe(() => {
      this.shopsService.getAllShops().subscribe((response) => {
        this.dialogData.shops = response;
        if (this.dialogData.styleId) {
          this.stylesService.getStyleLinkedShops(this.dialogData.styleId).subscribe(response => {
            this.linkedShops = response.data;
            this.dialogData.shops.forEach((shop) => {
              this.isLinked(shop.id);
            });
          },
            (error: HandledError) => {
              this.errorHandlingService.handleUiError(errorKey, error);
            });
        } else if (this.dialogData.linkedShops) {
          this.dialogData.shops.forEach((shop) => {
            this.isLinked(shop.id);
          });
        }
      });
    });

  }

  isLinked(id: string) {
    let isLinked = this.linkedShops.findIndex(item => item.shopId === id) > -1;
    if (isLinked) {
      let index = this.dialogData.shops.findIndex(shop => shop.id === id);
      this.dialogData.shops[index].linked = true;
      this.dialogData.shops[index].checked = true;
      return true;
    } else {
      let index = this.dialogData.shops.findIndex(shop => shop.id === id);
      this.dialogData.shops[index].linked = false;
      this.dialogData.shops[index].checked = false;
      return false;
    }
  }

  setSelectedShop(shopId: string) {

    if (this.linkedShops.findIndex(item => item.shopId === shopId) > -1) {
      this.selectedShop = this.linkedShops.find(item => {
        return item.shopId === shopId
      });
      this.linkText.setValue(this.selectedShop.linkText);
      this.linkUrl.setValue(this.selectedShop.linkUrl);
      this.thereIsAselectedShop = true;
    } else {
      this.thereIsAselectedShop = false;
    }

  }

  saveLink() {
    this.linkedShops.forEach(item => {
      if (this.selectedShop.shopId === item.shopId) {
        item.linkText = this.selectedShop.linkText;
        item.linkUrl = this.selectedShop.linkUrl;
      }
    });
  }

  editLinkModal(id: string) {
    this.setSelectedShop(id);
    this.modalRef = this.dialog.open(EditLinkComponent, {
      data: {
        data: this.selectedShop
      }
    });
    this.modalRef.afterClosed().subscribe((responce) => {
      if(responce){
        this.selectedShop = responce;
        this.saveLink();
      }
    });
  }

  verifyIfIsLinked(id: string) {
    let isLinked = this.linkedShops.findIndex(item => item.shopId === id) > -1;
    if (isLinked) {
      return true;
    }
    return false;
  }

}
