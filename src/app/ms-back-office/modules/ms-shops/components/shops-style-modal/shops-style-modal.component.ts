import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { Shop } from '../../models/shops';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
//
import { NewShopModalComponent } from '../new-shop-modal/new-shop-modal.component';
import { StylesService } from '../../../ms-style/services/styles.service';
import { ShopsService } from '../../services/shops.service';
import { SelectedShop } from '../../models/selected-shop';
import { ShopTreeComponent } from '../../../ms-shops-tree/components/shop-tree/shop-tree.component';
import { Subscription } from 'rxjs';

const errorKey = 'Error';

@Component({
    selector: 'app-shops-style-modal',
    templateUrl: './shops-style-modal.component.html',
    styleUrls: ['./shops-style-modal.component.scss']
})
export class ShopsStyleModalComponent implements OnInit, OnDestroy, AfterViewInit {

    answer = false;

    modalRef: MatDialogRef<NewShopModalComponent>;

    linkedShops: Array<SelectedShop> = [];

    shops: Array<Shop>;

    selectedShop: any;

    thereIsAselectedShop = false;

    linkText = new FormControl();

    linkUrl = new FormControl();

    @ViewChild(ShopTreeComponent) tree: ShopTreeComponent;

    subscriptions: Array<Subscription> = [];

    constructor(breakpointObserver: BreakpointObserver,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ShopsStyleModalComponent>,
        public errorHandlingService: ErrorHandlingService,
        private toastr: ToastrService,
        public shopsService: ShopsService,
        public stylesService: StylesService,
        @Inject(MAT_DIALOG_DATA) public dialogData: any) {

        const subObserve = breakpointObserver.observe([
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.HandsetLandscape,
            Breakpoints.HandsetPortrait
        ]).subscribe(result => {
            if (result.matches) {

            }
        });
        this.subscriptions.push(subObserve);
    }

    ngOnInit() {
        if (this.dialogData.shops) {
            this.shops = this.dialogData.shops;
        }
    }

    ngAfterViewInit() {
        this.updateLinkedShops();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    updateLinkedShops() {
        if (this.dialogData.styleId) {
            const subGetStyleLinkedShops = this.stylesService.getStyleLinkedShops(this.dialogData.styleId).subscribe(response => {
                this.linkedShops = response.data;
                // this.treeSelectShops();
            },
                (error: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, error);
                });
            this.subscriptions.push(subGetStyleLinkedShops);
        } else if (this.dialogData.linkedShops) {
            this.linkedShops = this.dialogData.linkedShops;
            // this.treeSelectShops();
        }
    }

    // treeSelectShops() {
    //     this.linkedShops.forEach((shop) => {
    //         this.tree.selectShop(shop);
    //     });
    // }

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

    save() {
        this.linkedShops = this.tree.getAllSelectedShops();
        if (this.dialogData.styleId) {
            const subPostStyleLinkedShops = this.stylesService.postStyleLinkedShops(this.dialogData.styleId, this.linkedShops)
                .subscribe(response => {
                    this.close();
                    this.toastr.success('Saved');
                },
                    (error: HandledError) => {
                        this.errorHandlingService.handleUiError(errorKey, error);
                    });
            this.subscriptions.push(subPostStyleLinkedShops);
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
                shops: this.shops,
            }
        });

        const subAfterClosed = this.modalRef.afterClosed().subscribe((createdShop: Shop) => {
            const subGetAllShops = this.shopsService.getAllShops().subscribe((shops: Shop[]) => {
                this.shops = shops;
            });
            this.subscriptions.push(subGetAllShops);
        });
        this.subscriptions.push(subAfterClosed);
    }
}
