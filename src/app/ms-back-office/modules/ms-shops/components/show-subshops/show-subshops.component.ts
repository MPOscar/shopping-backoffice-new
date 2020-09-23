import { AfterViewInit, Component, Input, Inject, OnInit, } from '@angular/core';
//
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
//import { setTranslations } from '@cognitec/ngx-translate';
//import { TRANSLATIONS } from './i18n/annotation-tool-modal.component.translations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
//
import { Shop } from '../../models/shops';
import { ShopsService } from '../../services/shops.service';
//import { Landmarks } from '../../models/landmarks';
import { ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
//
import { LinkShopsSubShopsModalComponent } from '../link-shops-subshops/link-shops-subshops-modal.component';

import { CollectionsService } from '../../../ms-collections/services/collections.service';

const errorKey = 'Error';

@Component({
  selector: 'show-subshops',
  templateUrl: './show-subshops.component.html',
  styleUrls: ['./show-subshops.component.css'],
})

export class ShowSubshopslComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'checkbox',
    'text',
    'url',
    'actions'
  ];

  modalRef: MatDialogRef<LinkShopsSubShopsModalComponent>;

  answer = false;

  flag: boolean = true;

  imageSrc: any = null;

  @Input() shops: Array<Shop>;

  linkedShops: Array<string> = [];

  oldLinkedShops: Array<string> = [];

  @Input() subShops: Array<Shop>;

  @Input() shopId: string;

  constructor(element: ElementRef,
    public dialog: MatDialog,
    breakpointObserver: BreakpointObserver,
    public errorHandlingService: ErrorHandlingService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    public collectionsService: CollectionsService,
    public shopsService: ShopsService,
  ) {
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

  }

  onNoClick(): void {
    this.close();
  }

  showLinkSubShopsModal() {
    this.modalRef = this.dialog.open(LinkShopsSubShopsModalComponent, {
      height: '90%',
      width: '90%',
      data: {
        shopId: this.shopId,
        shops: this.shops,
      }
    });

    this.modalRef.afterClosed().subscribe(() => {
      this.shopsService.getAllShops().subscribe((response) => {
        this.shops = response;

        this.subShops = [];
        this.subShops = this.shops.filter(shop => {
          return shop.parent === this.shopId;
        });

      });
    });

  }

}
