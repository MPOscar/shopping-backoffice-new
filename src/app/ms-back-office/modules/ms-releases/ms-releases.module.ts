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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

import { TranslateModule } from '@ngx-translate/core';
//
import { HttpRequestIndicatorModule } from '../../../http-request-indicator/http-request-indicator.module';
import { AskBeforeRefreshModule } from '../../../ui/modules/ask-before-refresh/ask-before-refresh.module';
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';
import { ImagesCardModule } from '../../../ui/modules/images-card/images-card.module';
//
import { ReleasesTableComponent } from './components/releases-table/releases-table.component';
import { ReleasesCollectionTableComponent } from './components/releases-collection-table/releases-collection-table.component';
import { ReleasesOutOfDateComponent } from './components/releases-out-of-date/releases-out-of-date.component';
import { MsReleasesRoutingModule } from './ms-releases-routing.module';
import { ReleaseFormComponent } from './components/release-form/release-form.component';
import { SeeReleaseComponent } from './components/see-release/see-release.component';
import { NewReleaseComponent } from './components/new-release/new-release.component';
import { NewReleaseModalComponent } from './components/new-release-modal/new-release-modal.component';
import { EditReleaseComponent } from './components/edit-release/edit-release.component';
import { EditReleaseModalComponent } from './components/edit-release-modal/edit-release-modal.component';
import { EditReleaseFormComponent } from './components/edit-release-form/edit-release-form.component';
import { DeleteReleaseComponent } from './components/delete-release/delete-release.component';

import { MsOffersModule } from '../ms-offers/ms-offers.module';
import { NewOfferComponent } from '../ms-offers/components/new-offer/new-offer.component';
import { NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
        MsReleasesRoutingModule,
        //
        AskBeforeRefreshModule,
        ErrorMessagesModule,
        HttpRequestIndicatorModule,
        ImagesCardModule,
        MsOffersModule,
        NgxMatSelectSearchModule

    ],
  declarations: [
    DeleteReleaseComponent,
    EditReleaseComponent,
    EditReleaseFormComponent,
    EditReleaseModalComponent,
    NewReleaseComponent,
    NewReleaseModalComponent,
    ReleaseFormComponent,
    ReleasesTableComponent,
    ReleasesCollectionTableComponent,
    ReleasesOutOfDateComponent,
    SeeReleaseComponent

  ],
  exports: [
    DeleteReleaseComponent,
    EditReleaseComponent,
    EditReleaseFormComponent,
    EditReleaseModalComponent,
    NewReleaseComponent,
    NewReleaseModalComponent,
    ReleaseFormComponent,
    ReleasesTableComponent,
    ReleasesCollectionTableComponent,
    ReleasesOutOfDateComponent,
    SeeReleaseComponent
  ],
  entryComponents: [
    NewOfferComponent,
    NewReleaseModalComponent,
    EditReleaseModalComponent,
    SeeReleaseComponent
  ]
})
export class MsReleasesModule { }
