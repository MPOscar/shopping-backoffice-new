import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { UrlsTableComponent } from './components/urls-table/urls-table.component';
import { DeleteUrlComponent } from './components/delete-url/delete-url.component';
import { EditUrlComponent } from './components/edit-url/edit-url.component';
import { NewUrlComponent } from './components/new-url/new-url.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { UrlsResolveService } from './services/urls-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: UrlsTableComponent,
        resolve: {
            config: ConfigResolveService
        }
    },
    {
        path: 'create',
        component: NewUrlComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            urls: UrlsResolveService

        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditUrlComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            urlId: IdResolveService
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteUrlComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            urlId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsUrlsRoutingModule { }
