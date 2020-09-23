import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';
//
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { CollectionsResolveService } from '../ms-collections/services/collections-resolve.service';
import { DealsResolveService } from '../ms-deals/services/deals-resolve.service';
import { OffersResolveService } from '../ms-offers/services/offers-resolve.service';
import { ReleasesResolveService } from '../ms-releases/services/releases-resolve.service';
import { ShopsResolveService } from '../ms-shops/services/shops-resolve.service';
import { StylesResolveService } from '../ms-style/services/styles-resolve.service';
import { UrlsResolveService } from '../ms-urls/services/urls-resolve.service';
//
import { DeleteLayoutComponent } from './components/delete-layout/delete-layout.component';
import { LayoutComponent } from './components/layout/layout.component';
// import { NewUrlComponent } from './components/new-url/new-url.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            brands: BrandsResolveService,
            categories: CategoriesResolveService,
            config: ConfigResolveService,
            collections: CollectionsResolveService,
            deals: DealsResolveService,
            offers: OffersResolveService,
            releases: ReleasesResolveService,
            shops: ShopsResolveService,
            styles: StylesResolveService,
        }
    },
    {
        path: 'create',
        component: LayoutComponent,
        resolve: {
            brands: BrandsResolveService,
            config: ConfigResolveService, 
            urls: UrlsResolveService

        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteLayoutComponent,
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
export class MsLayoutRoutingModule { }
