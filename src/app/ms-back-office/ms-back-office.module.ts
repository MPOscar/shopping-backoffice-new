
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//
import { BackOfficeComponent } from './components/back-office/back-office.component';

import { NavComponent } from './components/nav/nav.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { LayoutSliderTopnavComponent } from './components/layout-topnav/layout-slider-topnav.component';
import { MsBackOfficeRoutingModule } from './modules/ms-back-office-routing/ms-back-office-routing.module';
import { ConfigModule } from '../config/config.module';
import { SharedModule } from '../shared/shared.module';
import {TruncatePipe} from '../shared/pipes/truncate.pipe';
import {PipesModule} from '../shared/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        MsBackOfficeRoutingModule,
        ConfigModule,
        SharedModule
    ],
    declarations: [
        BackOfficeComponent,
        NavComponent,
        TopnavComponent,
        SidebarComponent,
        LayoutSliderTopnavComponent,
        TruncatePipe
    ],
    exports: [
        TruncatePipe
    ]
})
export class MsBackOfficeModule { }
