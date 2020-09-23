import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
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

import { DealsTableComponent } from './components/deals-table/deals-table.component';
import { DealsShopTableComponent } from './components/deals-shop-table/deals-shop-table.component';
import { MsDealsRoutingModule } from './ms-deals-routing.module';
import { DealCreatorComponent } from './components/deal-creator/deal-creator.component';
import { DealFormComponent } from './components/deal-form/deal-form.component';
import { NewDealComponent } from './components/new-deal/new-deal.component';
import { EditDealComponent } from './components/edit-deal/edit-deal.component';
import { DeleteDealComponent } from './components/delete-deal/delete-deal.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslateModule,
    MsDealsRoutingModule,
    AskBeforeRefreshModule,
    ImageCardModule,
    ErrorMessagesModule
  ],
  declarations: [
    DealsTableComponent,
    DealCreatorComponent,
    DealFormComponent,
    NewDealComponent,
    EditDealComponent,
    DeleteDealComponent,
    DealsShopTableComponent
  ],
  exports: [
    DealsTableComponent,
    DealCreatorComponent,
    DealFormComponent,
    NewDealComponent,
    EditDealComponent,
    DeleteDealComponent,
    DealsShopTableComponent
  ],
  entryComponents: [
    NewDealComponent,
    EditDealComponent,
  ]
})
export class MsDealsModule { }
