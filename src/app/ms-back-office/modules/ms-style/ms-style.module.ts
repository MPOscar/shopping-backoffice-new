import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AskBeforeRefreshModule } from '../../../ui/modules/ask-before-refresh/ask-before-refresh.module';
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';

import { StyleTableComponent } from './components/styles-table/styles-table.component';
import { MsStyleRoutingModule } from './ms-style-routing.module';
import { StyleFormComponent } from './components/style-form/style-form.component';
import { StyleParentFormComponent } from './components/style-parent-form/style-parent-form.component';
import { ParentStylesTreeRadioButonslist } from './components/styles-parent/styles-parent.component';
import { SeeStyleComponent } from './components/see-style/see-style.component';
import { NewStyleComponent } from './components/new-style/new-style.component';
import { NewParentModalComponent } from './components/new-parent/new-parent.component';
import { EditStyleComponent } from './components/edit-style/edit-style.component';
import { DeleteStyleComponent } from './components/delete-style/delete-style.component';

import { NewBrandComponent } from '../ms-brands/components/new-brand/new-brand.component';
import { MsBrandsModule } from '../ms-brands/ms-brands.module';
import { MsShopsModule } from '../ms-shops/ms-shops.module';
import { ShopsSellingStyleModalComponent } from '../ms-shops/components/shops-selling-style-modal/shops-selling-style-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogService } from 'src/app/ui/services/dialog.service';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MsStyleRoutingModule,
    AskBeforeRefreshModule,
    MsBrandsModule,
    MsShopsModule,
    ErrorMessagesModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
  ],
  declarations: [
    StyleTableComponent,
    StyleFormComponent,
    StyleParentFormComponent,
    NewStyleComponent,
    EditStyleComponent,
    DeleteStyleComponent,
    NewParentModalComponent,
    SeeStyleComponent,
    ParentStylesTreeRadioButonslist
  ],
  entryComponents: [
    ShopsSellingStyleModalComponent,
    NewBrandComponent,
    NewParentModalComponent,
    SeeStyleComponent
  ],
  providers: [DialogService]
})
export class MsStyleModule { }
