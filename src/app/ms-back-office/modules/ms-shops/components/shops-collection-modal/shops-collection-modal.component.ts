import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HandledError } from '../../../../../error-handling/models/handled-error';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { ToastrService } from '../../../../../error-handling/services/toastr.service';
import { CollectionsService } from '../../../ms-collections/services/collections.service';
import { ShopTreeComponent } from '../../../ms-shops-tree/components/shop-tree/shop-tree.component';
import { SelectedShop } from '../../models/selected-shop';
//
import { Shop } from '../../models/shops';
import { ShopsService } from '../../services/shops.service';
//
import { NewShopModalComponent } from '../new-shop-modal/new-shop-modal.component';


const errorKey = 'Error';

@Component({
    selector: 'app-shops-collection-modal',
    templateUrl: './shops-collection-modal.component.html',
    styleUrls: ['./shops-collection-modal.component.scss']
})
export class ShopsCollectionModalComponent implements OnInit {

    answer = false;

    modalRef: MatDialogRef<NewShopModalComponent>;

    linkedShops: Array<SelectedShop> = [];

    shops: Array<Shop>;
    filteredShops: Array<Shop>;

    selectedShop: any;

    thereIsAselectedShop = false;

    linkText = new FormControl();

    linkUrl = new FormControl();

    @Output() sendLinkedShops: EventEmitter<any> = new EventEmitter();

    @ViewChild(ShopTreeComponent) tree: ShopTreeComponent;

    constructor(breakpointObserver: BreakpointObserver,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ShopsCollectionModalComponent>,
        public errorHandlingService: ErrorHandlingService,
        private toastr: ToastrService,
        public shopsService: ShopsService,
        public collectionService: CollectionsService,
        @Inject(MAT_DIALOG_DATA) public dialogData: any) {

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
        this.shops = this.dialogData.shops;
        this.filteredShops = this.shops.filter(shop => shop.type !== 'physical');
        this.linkedShops = this.dialogData.linkedShops;
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

    save() {
        if (this.dialogData.collectionId) {
            this.linkedShops = this.tree.getAllSelectedShops();
            this.collectionService.postCollectionLinkedShops(this.dialogData.collectionId, this.linkedShops).subscribe(response => {
                this.dialogRef.close(this.linkedShops);
                this.toastr.success('Saved');
            },
                (error: HandledError) => {
                    this.errorHandlingService.handleUiError(errorKey, error);
                });
        } else {
            this.dialogRef.close(this.linkedShops);
        }

    }

    // showAddShopModal() {
    //     this.modalRef = this.dialog.open(NewShopModalComponent, {
    //         height: '90%',
    //         width: '90%',
    //         data: {
    //             brands: this.dialogData.brands,
    //             categories: this.dialogData.categories,
    //             shops: this.dialogData.shops,
    //         }
    //     });

    //     this.modalRef.afterClosed().subscribe((createdShop: Shop) => {
    //         if (createdShop) {
    //             this.treeService.insertShop(createdShop);
    //         }
    //     });
    // }

}
