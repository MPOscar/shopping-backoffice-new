import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//
import { AmazingTimePickerModule } from 'amazing-time-picker';
//
import { HttpRequestIndicatorModule } from '../../../http-request-indicator/http-request-indicator.module';
import { LoadingInterceptor } from './services/loading-interceptor.service';
import { AskBeforeRefreshModule } from '../../../ui/modules/ask-before-refresh/ask-before-refresh.module';
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';
import { SpinnerIndicator200Module } from '../../../ui/modules/spinner-indicator-200/spinner-indicator-200.module';

import { MsShopsRoutingModule } from './ms-shops-routing.module';
import { ShopsTableComponent } from './components/shops-table/shops-table.component';
import { ShopFormComponent } from './components/shop-form/shop-form.component';
import { NewShopComponent } from './components/new-shop/new-shop.component';
import { NewShopModalComponent } from './components/new-shop-modal/new-shop-modal.component';
import { EditShopComponent } from './components/edit-shop/edit-shop.component';
import { EditShopFormComponent } from './components/edit-shop-form/edit-shop-form.component';
import { DeleteShopComponent } from './components/delete-shop/delete-shop.component';
import { ShowSubshopslComponent } from './components/show-subshops/show-subshops.component';
import { ShopsSellingStyleModalComponent } from './components/shops-selling-style-modal/shops-selling-style-modal.component';
import { LinkShopsBrandModalComponent } from './components/link-shops-brand/link-shops-brand-modal.component';
import { LinkShopsSubShopsModalComponent } from './components/link-shops-subshops/link-shops-subshops-modal.component';
import { ImagesCardModule } from '../../../ui/modules/images-card/images-card.module';
import { MsDealsModule } from '../ms-deals/ms-deals.module';
import { MsOffersModule } from '../ms-offers/ms-offers.module';
import { MsLinksModule } from '../ms-links/ms-links.module';
import { EditLinkComponent } from '../ms-links/components/edit-link/edit-link.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageCardModule } from '../../../ui/modules/image-card/image-card.module';
import { ShopsStyleModalComponent } from './components/shops-style-modal/shops-style-modal.component';

import { ShopsCollectionTableComponent } from './components/shops-collection-table/shops-collection-table.component';
import { ShopsCollectionModalComponent } from './components/shops-collection-modal/shops-collection-modal.component';
import { MsShopsTreeModule } from '../ms-shops-tree/ms-shops-tree.module';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
    SharedModule,
    MsShopsRoutingModule,
    ImagesCardModule,
    ImageCardModule,
    AskBeforeRefreshModule,
    ErrorMessagesModule,
    HttpRequestIndicatorModule.forRoot(),
    SpinnerIndicator200Module,
    MsDealsModule,
    MsOffersModule,
    MsLinksModule,
    MsShopsTreeModule,
  ],
  declarations: [
    ShopsTableComponent,
    ShopFormComponent,
    NewShopComponent,
    NewShopModalComponent,
    EditShopComponent,
    EditShopFormComponent,
    DeleteShopComponent,
    LinkShopsBrandModalComponent,
    LinkShopsSubShopsModalComponent,
    ShopsSellingStyleModalComponent,
    ShowSubshopslComponent,
    ShopsStyleModalComponent,
    ShopsCollectionTableComponent,
    ShopsCollectionModalComponent
  ],
  exports: [
    ShopsTableComponent,
    ShopFormComponent,
    NewShopComponent,
    NewShopModalComponent,
    EditShopComponent,
    EditShopFormComponent,
    DeleteShopComponent,
    LinkShopsBrandModalComponent,
    LinkShopsSubShopsModalComponent,
    ShopsSellingStyleModalComponent,
    ShowSubshopslComponent,
    ShopsCollectionTableComponent
  ],
  entryComponents: [
    EditLinkComponent,
    LinkShopsBrandModalComponent,
    LinkShopsSubShopsModalComponent,
    NewShopModalComponent,
    ShopsSellingStyleModalComponent,
    ShopsStyleModalComponent
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },]
})
export class MsShopsModule { }
