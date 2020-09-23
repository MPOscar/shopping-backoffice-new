import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
//
import { TranslateService } from '@ngx-translate/core';
//
import { BaseReactiveFormComponent } from '../../../../../ui/components/base-reactive-form/base-reactive-form-component';
import { Brand } from '../../../ms-brands/models/brand';
import { BrandsService } from '../../../ms-brands/services/brands.service';
import { Shop } from '../../../ms-shops/models/shops';
import { Category } from '../../../ms-categories/models/category';
import { Style } from '../../models/style';
import { StylesService } from '../../services/styles.service';
import { NewParentModalComponent } from '../new-parent/new-parent.component';
import { ParentStylesTreeRadioButonslist } from '../styles-parent/styles-parent.component';

import { NewBrandComponent } from '../../../ms-brands/components/new-brand/new-brand.component';

import { ShopsSellingStyleModalComponent } from '../../../ms-shops/components/shops-selling-style-modal/shops-selling-style-modal.component';
import { ShopsService } from '../../../ms-shops/services/shops.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShopsStyleModalComponent } from '../../../ms-shops/components/shops-style-modal/shops-style-modal.component';
import { SelectedShop } from '../../../ms-shops/models/selected-shop';
import { Subscription, Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'style-form',
    templateUrl: './style-form.component.html',
    styleUrls: ['./style-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class StyleFormComponent extends BaseReactiveFormComponent<Style> implements OnInit, OnDestroy {

    @Input() brands: Array<Brand>;

    @Input() categories: Array<Category>;

    @Input() styles: Array<Style>;

    @Input() styleId: string;

    @Input() shops: Array<Shop>;

    @ViewChild(ParentStylesTreeRadioButonslist) parentStylesTreeRadioButonslist;

    allStyles: Array<Style>;

    modalRef: MatDialogRef<NewBrandComponent | NewParentModalComponent | ShopsSellingStyleModalComponent | ShopsStyleModalComponent>;

    linkedShops: Array<SelectedShop> = [];

    shop: Shop;

    createRelease = false;

    treeNode: Array<any> = [];

    styleName: string;

    style: Style;

    stylesParent: any;

    parent: string;

    subscriptions: Array<Subscription> = [];



    // ------- select filters-----------------------
    protected _onDestroy = new Subject<void>();

    public categoriesFilterCtrl: FormControl = new FormControl();

    public filteredCategory: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);

    public brandsFilterCtrl: FormControl = new FormControl();

    public filteredBrand: ReplaySubject<Brand[]> = new ReplaySubject<Brand[]>(1);

    constructor(
        public dialog: MatDialog,
        public location: Location,
        public brandsService: BrandsService,
        public stylesService: StylesService,
        public shopsService: ShopsService,
        translateService: TranslateService) {
        super(translateService);
    }


    ngOnInit() {
        this.style = this.styles.find(item => item.id === this.styleId);
        this.styles = this.styles.filter(item => item.id !== this.styleId);
        this.stylesParent = this.styles;
        if (this.style) {
            if (this.style.parent) {
                const parentStyle = this.styles.find(item => item.id === this.style.parent);
                this.parent = parentStyle ? parentStyle.name : '';
            }
            // this.stylesParent =  this.styles;

            this.stylesParent = this.styles.filter(style => {
                return style.brand === this.style.brand;
            });
        }

        this.styles.forEach(element => {
            if (!element.parent) {
                let item: any = [];
                item = {
                    'item': element.name,
                };

                this.treeNode = [...this.treeNode, item];

            }
        });

        const validationsErrors: any[] = [
            {
                type: 'required',
                key: 'Required Field',
                params: null,
                translation: ''
            }
        ];

        this.validationErrorMessages = validationsErrors;

        this.createFormGroup();

        this.allStyles = this.styles;

        // --- select filters----------------

        this.searchFilterSelect();

        this.styles.sort(function (a, b) {
            return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
        });
    }

    searchFilterSelect() {
        this.filteredCategory.next(this.categories.slice());

        this.categoriesFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCategories();
            });

        this.filteredBrand.next(this.brands.slice());

        this.brandsFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterBrands();
            });
    }

    protected filterBrands() {
        if (!this.brands) {
            return;
        }
        // get the search keyword
        let search = this.brandsFilterCtrl.value;
        if (!search) {
            this.filteredBrand.next(this.brands.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBrand.next(
            this.brands.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterCategories() {
        if (!this.categories) {
            return;
        }
        // get the search keyword
        let search = this.categoriesFilterCtrl.value;
        if (!search) {
            this.filteredCategory.next(this.categories.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredCategory.next(
            this.categories.filter(cat => cat.name.toLowerCase().indexOf(search) > -1)
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    createFormGroup() {
        this.formGroup = new FormGroup({
            name: new FormControl(this.data.name, [Validators.required]),
            description: new FormControl(this.data.description),
            brand: new FormControl(this.data.brand, [Validators.required]),
            parent: new FormControl(this.data.parent),
            categories: new FormControl(this.data.categories, [Validators.required]),
        });
    }

    submitClicked() {
        if (this.formGroup.valid) {
            this.data.createRelease = false;
            this.data.linkedShops = this.linkedShops;
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

    submitClickedCreateRelease() {
        if (this.formGroup.valid) {
            this.data.createRelease = true;
            this.data.linkedShops = this.linkedShops;
            this.accept.emit(this.data);
        } else {
            this.triggerValidation();
        }
    }

    showModalShopsStyle() {
        this.modalRef = this.dialog.open(ShopsStyleModalComponent, {
            height: '90%',
            width: '90%',
            data: {
                brands: this.brands,
                categories: this.categories,
                linkedShops: this.linkedShops,
                styleId: this.styleId,
                shops: this.shops,
            }
        });
        const subAfterClosed = this.modalRef.afterClosed().subscribe((results) => {
            this.linkedShops = results;
            const subAllShops = this.shopsService.getAllShops().subscribe((response) => {
                this.shops = response;
            });
            this.subscriptions.push(subAllShops);
        });
        this.subscriptions.push(subAfterClosed);
    }


    showModalAddNewBrand() {
        this.modalRef = this.dialog.open(NewBrandComponent, {
            height: '90%',
            data: { face: this.shop }
        });

        const subAfterClosed = this.modalRef.afterClosed().subscribe(resp => {
            const subGetAllBrands = this.brandsService.getAllBrands().subscribe((response) => {
                this.brands = response;
                this.filteredBrand.next(this.brands.slice());
                this.formGroup.get('brand').setValue(resp);
                this.data.brand = resp;
            });
            this.subscriptions.push(subGetAllBrands);
        });
        this.subscriptions.push(subAfterClosed);
    }

    showModalAddNewParent() {
        this.modalRef = this.dialog.open(NewParentModalComponent, {
            data: {
                brands: this.brands,
                categories: this.categories,
                face: this.shop,
                styles: this.styles,
            }
        });

        const subAfterClosed = this.modalRef.afterClosed().subscribe(resp => {
            const subGetAllStyles = this.stylesService.getAllStyles().subscribe((response) => {
                this.styles = response;
                this.parent = response.find(r => r.id === resp).name;
                // this.parentStylesTreeRadioButonslist.buildTreeArray(response);
                this.stylesParent = response;
                this.formGroup.get('parent').setValue(resp);
                this.data.parent = resp;
                this.styleId = resp;
                this.styleName = this.parent;
            });
            this.subscriptions.push(subGetAllStyles);
        });
        this.subscriptions.push(subAfterClosed);
    }

    selectBrand(brandId: string) {
        if (brandId) {
            this.stylesParent = this.styles.filter(style => {
                return style.brand === brandId;
            });
            this.setParent(this.parent);
        } else {
            this.stylesParent = this.styles;
        }
        // this.parentStylesTreeRadioButonslist.buildTreeArray(this.stylesParent);

    }

    getChildren(id: string) {
        let childrens: any = [];
        this.styles.forEach(element => {
            if (element.parent === id) {
                const item: any = [];
                item['label'] = element.name;
                item['collapsedIcon'] = 'fa-folder';
                item['children'] = this.getChildren(element.id);
                childrens = [...childrens, item];
            }
        });
        return childrens;
    }

    setParent(parentName: string) {
        const selectedParent = this.stylesParent.find(item => {
            return item.name === parentName;
        });
        if (parentName !== 'Parent' && parentName !== 'None' && selectedParent) {
            this.formGroup.get('parent').setValue(selectedParent.id);
            this.data.parent = this.formGroup.get('parent').value;
            this.parent = selectedParent.name;
        } else {
            this.formGroup.get('parent').setValue('');
            this.data.parent = '';
            this.parent = '';
        }

    }

}

