import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
//
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//
import { ErrorHandlingService } from '../../../../../error-handling/services/error-handling.service';
import { Release } from '../../../ms-releases/models/releases';
import { Brand } from '../../../ms-brands/models/brand';



@Component({
  // tslint:disable-next-line: component-selector
  selector: 'menu-brands-new-product',
  templateUrl: './menu-brands-new-product.html',
  styleUrls: ['./menu-brands-new-product.scss']
})


export class MenuBrandsNewProductComponent implements OnInit, OnDestroy {

  filter: FormGroup;

  filterValueChanges: Subscription;
  brands: Array<Brand>;

  selected: Array<string>;

  type = 'brand';

  element = {
    id: '',
    type: '',
    name: ''
  };
  constructor(
      public dialog: MatDialog,
      public errorHandlingService: ErrorHandlingService,
      public dialogRef: MatDialogRef<MenuBrandsNewProductComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData: any
      ) {
  }

  ngOnInit() {
      this.brands = this.dialogData.brands;
      this.selected = this.dialogData.selected;
      this.type = this.dialogData.type ? this.dialogData.type : 'brand';
      this.filter = this.createFilterFormGroup();
      this.filterValueChanges = this.filter.valueChanges.pipe(debounceTime(500))
            .subscribe(change => this.changeType());
  }

  changeType() {
    this.type = this.filter.value.typeProd;
  }

  ngOnDestroy() {
      this.filterValueChanges.unsubscribe();
  }

  createFilterFormGroup() {
      const group: any = {};
      group['typeProd'] = new FormControl(this.type);
      return new FormGroup(group);
  }

  selectedProduct(product: any) {
    this.element.id = product.id;
    this.element.type = this.type;
    this.element.name = product.name;

    this.dialogRef.close(this.element);
  }

  cancelClicked() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}

