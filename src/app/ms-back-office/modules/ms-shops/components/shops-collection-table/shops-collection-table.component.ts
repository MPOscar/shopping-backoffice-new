import { Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
//
import { ConfigService } from '../../../../../config/services/config.service';
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { Shop } from '../../models/shops';
import { ShopsService } from '../../services/shops.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EditLinkComponent } from '../../../ms-links/components/edit-link/edit-link.component';
import { SelectedShop } from '../../models/selected-shop';
import { ShopsCollectionModalComponent } from '../shops-collection-modal/shops-collection-modal.component';
import { HandledError } from 'src/app/error-handling/models/handled-error';
import { CollectionsService } from '../../../ms-collections/services/collections.service';
import { ToastrService } from 'src/app/error-handling/services/toastr.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

const errorKey = 'Error';

@Component({
    selector: 'shops-collection-table',
    templateUrl: './shops-collection-table.component.html',
    styleUrls: ['./shops-collection-table.component.scss']
})
export class ShopsCollectionTableComponent implements OnInit {

    displayedColumns: string[] = [
        'name',
        // 'thumbnail',
        'active',
        'country',
        'currency',
        // 'updatedAt',
        'rank',
        // 'shipingDetails',
        'action'
    ];


    @Input() collectionId: string;

    @ViewChild(MatSort) sort: MatSort;

    @Input() shops: Array<Shop> = [];

    shopsToShow: Array<Shop> = [];

    dataSource = new MatTableDataSource(this.shopsToShow);

    linkedShops: Array<SelectedShop> = [];

    modalRef: MatDialogRef<EditLinkComponent | ShopsCollectionModalComponent>;

    showTab = true;

    constructor(
        public activatedRoute: ActivatedRoute,
        public configService: ConfigService,
        public dialog: MatDialog,
        public errorHandlingService: ErrorHandlingService,
        public shopsService: ShopsService,
        public collectionsService: CollectionsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private toastr: ToastrService,
        public collectionService: CollectionsService,
    ) {
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
    }


    get selectedShops(): SelectedShop[] {
        return this.linkedShops;
    }

    @Input()
    set selectedShops(selectedShops: SelectedShop[]) {
        this.shopsToShow = [];
        if (selectedShops) {
            for (const shop of this.shops) {
                const selected = selectedShops.find(s => s.shopId === shop.id);
                if (selected) {
                    shop.hasLink = (Boolean)(selected.linkText && selected.linkUrl);
                    this.shopsToShow.push(shop);
                }
            }
        }
        this.linkedShops = selectedShops;
        this.refresh();
        // this.totalLength = this.shopsToShow.length;
    }


    editLinkModal(id: string) {
        this.modalRef = this.dialog.open(EditLinkComponent, {
            data: {
                data: this.selectedShops.find(shop => shop.shopId === id),
                shop: this.shops.find((shop => shop.id === id))
            }
        });
        this.modalRef.afterClosed().subscribe((response) => {
            if (response) {
                const changedShop = this.shopsToShow.find(s => s.id === response.shopId);
                changedShop.hasLink = (response.linkText && response.linkUrl);
                const shop = this.linkedShops.find(s => s.shopId === response.shopId);
                shop.linkText = response.linkText;
                shop.linkUrl = response.linkUrl;
                this.save();
            }
        });
    }

    linkShopsModal() {
        this.showTab = false;
        this.modalRef = this.dialog.open(ShopsCollectionModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                collectionId: this.collectionId,
                shops: this.shops,
                linkedShops: this.linkedShops
            }
        });
        this.modalRef.afterClosed().subscribe((linkedShops: Array<SelectedShop>) => {
            this.selectedShops = linkedShops.filter(shop => !shop.isParent);
            this.showTab = true;
        });
    }

    refresh() {
        this.dataSource = new MatTableDataSource(this.shopsToShow);
        this.dataSource.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
    }

    save() {
        this.collectionService.postCollectionLinkedShops(this.collectionId, this.linkedShops).subscribe(response => {
            this.toastr.success('Saved');
            this.refresh();
        },
            (error: HandledError) => {
                this.errorHandlingService.handleUiError(errorKey, error);
            });

    }
}

