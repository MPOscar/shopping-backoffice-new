import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { DeleteShopComponent } from './components/delete-shop/delete-shop.component';
import { EditShopComponent } from './components/edit-shop/edit-shop.component';
import { NewShopComponent } from './components/new-shop/new-shop.component';
import { ShopsTableComponent } from './components/shops-table/shops-table.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';
import { UrlsResolveService } from '../ms-urls/services/urls-resolve.service';
import { ShopsResolveService } from './services/shops-resolve.service';
import { ReleasesResolveService } from '../ms-releases/services/releases-resolve.service';
import { CollectionsResolveService } from '../ms-collections/services/collections-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: ShopsTableComponent,
        resolve: {
            config: ConfigResolveService,
        }
    },
    {
        path: 'create',
        component: NewShopComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            shopId: IdResolveService,
            categories: CategoriesResolveService,
            urls: UrlsResolveService,
            shops: ShopsResolveService,
            releases: ReleasesResolveService,
            collections: CollectionsResolveService

        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditShopComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            shopId: IdResolveService,
            categories: CategoriesResolveService,
            urls: UrlsResolveService,
            shops: ShopsResolveService,
            releases: ReleasesResolveService,
            collections: CollectionsResolveService

        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteShopComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            shopId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsShopsRoutingModule { }
