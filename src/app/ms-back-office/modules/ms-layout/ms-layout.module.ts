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
import { ImageCardModule } from '../../../ui/modules/image-card/image-card.module';
import { ImagesLayoutCardModule } from '../../../ui/modules/images-layout-card/images-layout-card.module';
//

import { LayoutComponent } from './components/layout/layout.component';
import { DeleteLayoutComponent } from './components/delete-layout/delete-layout.component';
import { MsLayoutRoutingModule } from './ms-layout-routing.module';

import { LayoutSliderTopnavComponent } from './components/layout-topnav/layout-slider-topnav.component';
import { HeadingFormComponent } from './components/heading-form/heading-form.component';
import { EditHeadingComponent } from './components/edit-heading/edit-heading.component';

import { HeadersComponent } from './components/headers/headers.component';
import { HeadersFormComponent } from './components/headers-form/headers-form.component';
import { HottestComponent } from './components/hottest/hottest.component';
import { HottestFormComponent } from './components/hottest-form/hottest-form.component';
import { OursPartnersComponent } from './components/ours-partners/ours-partners.component';
import { OursPartnersFormComponent } from './components/ours-partners-form/ours-partners-form.component';
import { SlidersComponent } from './components/sliders/sliders.component';
import { SlidersFormComponent } from './components/sliders-form/sliders-form.component';
import { SlidersNewProductComponent } from './components/slider-new-product/slider-new-product.component';
import { SlidersNewProductCollectionsComponent } from './components/slider-new-product-collections/slider-new-product-collections.component';
import { SlidersNewProductOffersComponent } from './components/slider-new-product-offers/slider-new-product-offers.component';
import { SlidersNewProductReleasesComponent } from './components/slider-new-product-releases/slider-new-product-releases.component';
import { MenuBrandsComponent } from './components/menu-brands/menu-brands.component';
import { MenuBrandsFormComponent } from './components/menu-brands-form/menu-brands-form.component';
import {MenuBrandsNewComponent} from './components/menu-brands-new/menu-brands-new.component';
import {MenuBrandsNewProductComponent} from './components/menu-brands-new-product/menu-brands-new-product.component';
import {MatChipsModule} from '@angular/material/chips';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {MsBackOfficeModule} from '../../ms-back-office.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';

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
        MatMenuModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        TranslateModule,
        MsLayoutRoutingModule,
        AskBeforeRefreshModule,
        ImageCardModule,
        ImagesLayoutCardModule,
        MatRadioModule,
        MatChipsModule,
        PipesModule,
        MsBackOfficeModule
    ],
  declarations: [
    DeleteLayoutComponent,
    EditHeadingComponent,
    HeadingFormComponent,
    HottestComponent,
    HottestFormComponent,
    LayoutComponent,
    LayoutSliderTopnavComponent,
    HeadersComponent,
    HeadersFormComponent,
    OursPartnersComponent,
    OursPartnersFormComponent,
    SlidersComponent,
    SlidersFormComponent,
    SlidersNewProductComponent,
    SlidersNewProductCollectionsComponent,
    SlidersNewProductOffersComponent,
    SlidersNewProductReleasesComponent,
    MenuBrandsComponent,
    MenuBrandsFormComponent,
    MenuBrandsNewComponent,
      MenuBrandsNewProductComponent
  ],
  exports: [
    DeleteLayoutComponent,
    EditHeadingComponent,
    HeadingFormComponent,
    HeadersComponent,
    HeadersFormComponent,
    HottestComponent,
    HottestFormComponent,
    LayoutComponent,
    LayoutSliderTopnavComponent,
    OursPartnersComponent,
    OursPartnersFormComponent,
    MenuBrandsComponent,
    MenuBrandsFormComponent,
    MenuBrandsNewComponent,
    MenuBrandsNewProductComponent
  ],
  entryComponents: [
    SlidersNewProductComponent,
    MenuBrandsNewProductComponent
  ]
})
export class MsLayoutModule { }
