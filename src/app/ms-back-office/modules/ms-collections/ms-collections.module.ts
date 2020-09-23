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


import { MsOffersModule } from '../ms-offers/ms-offers.module';
import { MsLinksModule } from '../ms-links/ms-links.module';
import { EditLinkComponent } from '../ms-links/components/edit-link/edit-link.component';
import { MsShopsModule } from '../ms-shops/ms-shops.module';
import { MsReleasesModule } from '../ms-releases/ms-releases.module';
import { NewReleaseModalComponent } from '../ms-releases/components/new-release-modal/new-release-modal.component';
import { LinkOffersCollentionModalComponent } from '../ms-offers/components/link-offers-collection/link-offers-collection-modal.component';

import { MsCollectionsRoutingModule } from './ms-collections-routing.module';
import { CollectionCreatorComponent } from './components/collection-creator/collection-creator.component';
import { CollectionsTableComponent } from './components/collections-table/collections-table.component';
import { CollectionFormComponent } from './components/collection-form/collection-form.component';
import { SeeCollectionComponent } from './components/see-collection/see-collection.component';
import { NewCollectionComponent } from './components/new-collection/new-collection.component';
import { EditCollectionComponent } from './components/edit-collection/edit-collection.component';
import { EditCollectionFormComponent } from './components/edit-collection-form/edit-collection-form.component';
import { DeleteCollectionComponent } from './components/delete-collection/delete-collection.component';
import { ShopsCollectionModalComponent } from '../ms-shops/components/shops-collection-modal/shops-collection-modal.component';
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
    MsCollectionsRoutingModule,
    AskBeforeRefreshModule,
    ImageCardModule,
    ErrorMessagesModule,
    MsOffersModule,
    MsLinksModule,
    MsReleasesModule,
    MsShopsModule,
  ],
  declarations: [
    CollectionCreatorComponent,
    CollectionsTableComponent,
    CollectionFormComponent,
    NewCollectionComponent,
    EditCollectionComponent,
    EditCollectionFormComponent,
    DeleteCollectionComponent,
    SeeCollectionComponent
  ],
  exports: [
    CollectionCreatorComponent,
    CollectionsTableComponent,
    CollectionFormComponent,
    NewCollectionComponent,
    EditCollectionComponent,
    EditCollectionFormComponent,
    DeleteCollectionComponent,
    SeeCollectionComponent
  ],
  entryComponents: [
    EditLinkComponent,
    NewCollectionComponent,
    ShopsCollectionModalComponent,
    LinkOffersCollentionModalComponent,
    NewReleaseModalComponent,
    SeeCollectionComponent
  ],
  providers: [
    MatTabsModule
  ]
})
export class MsCollectionsModule { }
