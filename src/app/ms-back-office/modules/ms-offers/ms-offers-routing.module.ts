import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { OffersTableComponent } from './components/offers-table/offers-table.component';
import { DeleteOfferComponent } from './components/delete-offer/delete-offer.component';
import { EditOfferComponent } from './components/edit-offer/edit-offer.component';
import { NewOfferComponent } from './components/new-offer/new-offer.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { CollectionsResolveService } from '../ms-collections/services/collections-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { ReleasesResolveService } from '../ms-releases/services/releases-resolve.service';
import { ShopsResolveService } from '../ms-shops/services/shops-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: OffersTableComponent,
        resolve: {
            config: ConfigResolveService,
            collections: CollectionsResolveService,
            shops: ShopsResolveService,
            releases: ReleasesResolveService
        }
    },
    {
        path: 'create',
        component: NewOfferComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService,
            shops: ShopsResolveService,
            releases: ReleasesResolveService
        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditOfferComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            styleId: IdResolveService
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteOfferComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            brandId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsOffersRoutingModule { }
