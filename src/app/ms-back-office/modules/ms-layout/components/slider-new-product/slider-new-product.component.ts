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
import { Shop } from '../../../ms-shops/models/shops';



@Component({
  // tslint:disable-next-line: component-selector
  selector: 'slider-new-product',
  templateUrl: './slider-new-product.component.html',
  styleUrls: ['./slider-new-product.component.scss']
})


export class SlidersNewProductComponent implements OnInit, OnDestroy {

  filter: FormGroup;

  filterValueChanges: Subscription;

  releases: Array<Release>;
  brands: Array<Brand>;

  shops: Array<Shop>;

  type = 'offer';

  element = {
    id: '',
    type: '',
    name: ''
  };



  constructor(
      public dialog: MatDialog,
      public errorHandlingService: ErrorHandlingService,
      public dialogRef: MatDialogRef<SlidersNewProductComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData: any
      ) {
  }

  ngOnInit() {
      this.releases = this.dialogData.releases;
      this.brands = this.dialogData.brands;
      this.shops = this.dialogData.shops;
      this.type = this.dialogData.type ? this.dialogData.type : 'offer';
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

