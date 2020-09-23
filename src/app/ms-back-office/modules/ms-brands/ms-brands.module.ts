import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

import { TranslateModule } from '@ngx-translate/core';
//
import { AskBeforeRefreshModule } from '../../../ui/modules/ask-before-refresh/ask-before-refresh.module';
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';
import { ImageCardModule } from '../../../ui/modules/image-card/image-card.module';

import { BrandsTableComponent } from './components/brands-table/brands-table.component';
import { MsBrandsRoutingModule } from './ms-brands-routing.module';
import { BrandCreatorComponent } from './components/brand-creator/brand-creator.component';
import { BrandFormComponent } from './components/brand-form/brand-form.component';
import { SeeBrandComponent } from './components/see-brand/see-brand.component';
import { NewBrandComponent } from './components/new-brand/new-brand.component';
import { EditBrandComponent } from './components/edit-brand/edit-brand.component';
import { EditBrandFormComponent } from './components/edit-brand-form/edit-brand-form.component';
import { DeleteBrandComponent } from './components/delete-brand/delete-brand.component';
import { MsShopsModule } from '../ms-shops/ms-shops.module';
import { LinkShopsBrandModalComponent } from '../ms-shops/components/link-shops-brand/link-shops-brand-modal.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslateModule,
    MsBrandsRoutingModule,
    AskBeforeRefreshModule,
    ImageCardModule,
    ErrorMessagesModule,
    MsShopsModule,

  ],
  declarations: [
    BrandsTableComponent,
    BrandCreatorComponent,
    BrandFormComponent,
    NewBrandComponent,
    EditBrandComponent,
    EditBrandFormComponent,
    DeleteBrandComponent,
    SeeBrandComponent
  ],
  entryComponents: [
    NewBrandComponent,
    LinkShopsBrandModalComponent,
    SeeBrandComponent
  ]
})
export class MsBrandsModule { }
