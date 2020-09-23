import { AfterViewInit, Component, Inject, OnInit, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
//
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
// import { setTranslations } from '@cognitec/ngx-translate';
// import { TRANSLATIONS } from './i18n/annotation-tool-modal.component.translations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { ShopsService } from '../../services/shops.service';
// import { Landmarks } from '../../models/landmarks';
import { ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { Shop, ShopsListResponse } from "../../models/shops";
//
import { CollectionsService } from '../../../ms-collections/services/collections.service';

const errorKey = 'Error';

@Component({
  selector: 'link-shops-subshops-modal',
  templateUrl: './link-shops-subshops-modal.component.html',
  styleUrls: ['./link-shops-subshops-modal.component.css'],
})

export class LinkShopsSubShopsModalComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'checkbox',
    'text',
    'url',
    'actions'
  ];

  links: any[] = [{ text: "lalala", url: "url" }, { text: "lalala", url: "url" }, { text: "lalala", url: "url" }]
  answer = false;

  filter: FormGroup;

  filterValueChanges: Subscription;

  flag: boolean = true;

  imageSrc: any = null;

  shops: Array<Shop>;

  linkedShops: Array<string> = [];

  oldLinkedShops: Array<string> = [];

  subShops: Array<Shop>;

  shopsList: Subscription;

  constructor(element: ElementRef,
    breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<LinkShopsSubShopsModalComponent>,
    public errorHandlingService: ErrorHandlingService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    public collectionsService: CollectionsService,
    public shopsService: ShopsService,
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
    this.filter = this.createFilterFormGroup();
    this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500)).subscribe(change => this.loadPage());

    /*this.shopsList = this.shopsService.shopsList.subscribe((shopsList: any) => {
      this.shops = shopsList.data;

      this.subShops = this.shops.filter(shop => {
        return !shop.isParent;
      });

      this.subShops.forEach((shop) => {
        //this.isLinked(shop.id);
        if (shop.parent === this.dialogData.shopId) {
          shop.linked = true;
          shop.checked = true;
        } else {
          shop.linked = false;
          shop.checked = false;
        }
      });

      this.shopsService.reloadShops().subscribe(response => {
        this.shopsService.shopsList.next(response);
      },
        (error: HandledError) => this.errorHandlingService.handleUiError(errorKey, error));

    });*/


    this.subShops = this.dialogData.shops.filter(shop => {
      return !shop.isParent;
    });

    this.subShops.forEach((shop) => {
      //this.isLinked(shop.id);
      if (shop.parent === this.dialogData.shopId) {
        shop.linked = true;
        shop.checked = true;
      } else {
        shop.linked = false;
        shop.checked = false;
      }
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

  createFilterFormGroup() {
    let group: any = {};
    group['name'] = new FormControl('');
    return new FormGroup(group);
  }

  onNoClick(): void {
    this.close();
  }

  linked(shopData: Shop) {
    shopData.linked = !shopData.linked;
    if (shopData.linked) {
      shopData.parent = this.dialogData.shopId;
    } else {
      shopData.parent = "";
    }

    this.shopsService.putShop(shopData).subscribe(response => {
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
      });
  }

  save() {
    this.shopsService.postShopLinkedSubShops(this.dialogData.shopId, this.linkedShops).subscribe(response => {
      this.close();
      this.toastr.success("Saved");
    },
      (error: HandledError) => {
        this.errorHandlingService.handleUiError(errorKey, error);
      });
  }

  isLinked(id: string) {
    let isLinked = this.linkedShops.findIndex(shopId => shopId === id) > -1;
    if (isLinked) {
      let index = this.dialogData.shops.findIndex(shop => shop.id === id);
      this.dialogData.shops[index].linked = true;
      this.dialogData.shops[index].checked = true;
    } else {
      let index = this.dialogData.shops.findIndex(shop => shop.id === id);
      this.dialogData.shops[index].linked = false;
      this.dialogData.shops[index].checked = false;
    }
  }

  loadPage() {
    this.shopsService.getShops(
      Object.assign({}, this.filter.value),
      "name", "desc",
      0, 50).subscribe((response: ShopsListResponse) => {
        this.shopsService.shopsList.next(response);
      },
        (err: HandledError) => {
          this.errorHandlingService.handleUiError(errorKey, err)
        });
  }

}
