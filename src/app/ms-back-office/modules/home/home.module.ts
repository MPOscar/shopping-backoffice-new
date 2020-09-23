import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
//
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
//
import { ErrorMessagesModule } from '../../../ui/modules/error-messages/error-messages.module';
//

import { StatModule } from '../../../shared/modules/stat/stat.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MsTasksModule } from '../ms-tasks/ms-tasks.module';
import { MsReleasesModule } from '../ms-releases/ms-releases.module';
import { MsContactDetailModule } from '../ms-contact-detail/ms-contact-detail.module';
import { MsGDPRModule } from '../ms-gdpr/ms-gdpr.module';
import { MsPrivacyModule } from '../ms-privacy/ms-privacy.module';
import { MsSocialNetworksModule } from '../ms-social-networks/ms-social-networks.module';
//
import { EditPrivacyComponent } from '../ms-privacy/components/edit-privacy/edit-privacy.component';
import { EditGDPRComponent } from '../ms-gdpr/components/edit-gdpr/edit-gdpr.component';
import { EditSocialNetworksComponent } from '../ms-social-networks/components/edit-social-networks/edit-social-networks.component';
import { EditContactDetailComponent } from '../ms-contact-detail/components/edit-contact-detail/edit-contact-detail.component';
import { EditBecomePartnerComponent } from '../ms-become-partner/components/edit-become-partner/edit-become-partner.component';
import { EditWhoAreWeComponent } from '../ms-who-are-we/components/edit-who-are-we/edit-who-are-we.component';
import { MsBecomePartnerModule } from '../ms-become-partner/ms-become-partner.module';
import { MsWhoAreWeModule } from '../ms-who-are-we/ms-who-are-we.module';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HomeRoutingModule,
        MatGridListModule,
        StatModule,
        FlexLayoutModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MsContactDetailModule,
        MsGDPRModule,
        MsPrivacyModule,
        MsReleasesModule,
        MsTasksModule,
        MsSocialNetworksModule,
        ErrorMessagesModule,
        MsBecomePartnerModule,
        MsWhoAreWeModule
    ],
    declarations: [
        HomeComponent
    ],
    entryComponents: [
        EditContactDetailComponent,
        EditGDPRComponent,
        EditPrivacyComponent,
        EditSocialNetworksComponent,
        EditBecomePartnerComponent,
        EditWhoAreWeComponent,
    ]
})
export class HomeModule { }
