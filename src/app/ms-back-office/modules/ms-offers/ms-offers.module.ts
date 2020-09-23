import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
//
import { AmazingTimePickerModule } from 'amazing-time-picker';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

import { TranslateModule } from '@ngx-translate/core';
//
import { MsLinksModule } from './modules/links/links.module';
//
import { ImagesCardModule } from '../../../ui/modules/images-card/images-card.module';
import { AskBeforeRefreshModule } from '../../../ui/modules/ask-before-refresh/ask-before-refresh.module';
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';
//
import { OffersTableComponent } from './components/offers-table/offers-table.component';
import { OffersCollectionTableComponent } from './components/offers-collection-table/offers-collection-table.component';
import { OffersReleaseTableComponent } from './components/offers-release-table/offers-release-table.component';
import { OffersNewReleaseTableComponent } from './components/offers-new-release-table/offers-new-release-table.component';
import { OffersShopTableComponent } from './components/offers-shop-table/offers-shop-table.component';
import { LinkOffersCollentionModalComponent } from './components/link-offers-collection/link-offers-collection-modal.component';
import { MsOffersRoutingModule } from './ms-offers-routing.module';
import { OfferFormComponent } from './components/offer-form/offer-form.component';
import { SeeOfferComponent } from './components/see-offer/see-offer.component';
import { NewOfferComponent } from './components/new-offer/new-offer.component';
import { NewOfferReleaseCreatorComponent } from './components/new-offer-release-creator/new-offer-release-creator.component';
import { NewOfferShopCreatorComponent } from './components/new-offer-shop-creator/new-offer-shop-creator.component';
import { EditOfferComponent } from './components/edit-offer/edit-offer.component';
import { EditOfferReleaseCreatorComponent } from './components/edit-offer-release-creator/edit-offer-release-creator.component';
import { DeleteOfferComponent } from './components/delete-offer/delete-offer.component';

import {MatStepperModule} from '@angular/material/stepper';
import { MsShopsTreeModule } from '../ms-shops-tree/ms-shops-tree.module';
import {MatExpansionModule} from '@angular/material/expansion';

import { EditLinkComponent } from '../ms-links/components/edit-link/edit-link.component';
import { OfferFormMultipleComponent } from './components/offer-form-multiple/offer-form-multiple.component';
import { OfferFormNewComponent } from './components/offer-form-new/offer-form-new.component';
import { ValidationModule } from 'src/app/validation/validation.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
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
    MatNativeDateModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslateModule,
    MsOffersRoutingModule,
    MsLinksModule,
    AskBeforeRefreshModule,
    ImagesCardModule,
    ErrorMessagesModule,
    MatStepperModule,
    MatExpansionModule,
    MsShopsTreeModule,
    MatCardModule,
    ValidationModule,
  ],
  declarations: [
    OffersCollectionTableComponent,
    OffersTableComponent,
    OfferFormComponent,
    OfferFormMultipleComponent,
    OfferFormNewComponent,
    OffersReleaseTableComponent,
    OffersNewReleaseTableComponent,
    OffersShopTableComponent,
    LinkOffersCollentionModalComponent,
    NewOfferComponent,
    NewOfferReleaseCreatorComponent,
    NewOfferShopCreatorComponent,
    EditOfferComponent,
    EditOfferReleaseCreatorComponent,
    DeleteOfferComponent,
    SeeOfferComponent
  ],
  exports: [
    OffersCollectionTableComponent,
    OffersTableComponent,
    OfferFormComponent,
    OffersReleaseTableComponent,
    OffersShopTableComponent,
    OffersNewReleaseTableComponent,
    LinkOffersCollentionModalComponent,
    NewOfferComponent,
    NewOfferReleaseCreatorComponent,
    NewOfferShopCreatorComponent,
    EditOfferComponent,
    EditOfferReleaseCreatorComponent,
    DeleteOfferComponent,
    SeeOfferComponent,
    MsShopsTreeModule,
  ],
  providers: [
    DatePipe
  ],
  entryComponents: [
    EditLinkComponent,
    EditOfferComponent,
    EditOfferReleaseCreatorComponent,
    NewOfferComponent,
    NewOfferReleaseCreatorComponent,
    NewOfferShopCreatorComponent,
    LinkOffersCollentionModalComponent,
    SeeOfferComponent
  ]
})
export class MsOffersModule { }
