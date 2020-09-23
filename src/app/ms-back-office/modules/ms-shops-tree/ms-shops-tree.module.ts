import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { HttpRequestIndicatorModule } from '../../../http-request-indicator/http-request-indicator.module';
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';
import { SpinnerIndicator200Module } from '../../../ui/modules/spinner-indicator-200/spinner-indicator-200.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { ShopTreeComponent } from './components/shop-tree/shop-tree.component';
import { EditLinkComponent } from '../ms-links/components/edit-link/edit-link.component';
import { MsLinksModule } from '../ms-links/ms-links.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ErrorMessagesModule,
    HttpRequestIndicatorModule.forRoot(),
    SpinnerIndicator200Module,
    MsLinksModule
  ],
  entryComponents: [
    EditLinkComponent
  ],
  declarations: [
    ShopTreeComponent,
  ],
  exports: [
    ShopTreeComponent,
  ],
})
export class MsShopsTreeModule { }
