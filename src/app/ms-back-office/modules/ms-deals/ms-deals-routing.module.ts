import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { DealsTableComponent } from './components/deals-table/deals-table.component';
import { DealCreatorComponent } from './components/deal-creator/deal-creator.component';
import { DeleteDealComponent } from './components/delete-deal/delete-deal.component';
import { EditDealComponent } from './components/edit-deal/edit-deal.component';
import { NewDealComponent } from './components/new-deal/new-deal.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { DealsResolveService } from './services/deals-resolve.service';
import { CollectionsResolveService } from '../ms-collections/services/collections-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { UrlsResolveService } from '../ms-urls/services/urls-resolve.service';
import { ShopsResolveService } from '../ms-shops/services/shops-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: DealsTableComponent,
        resolve: {
            config: ConfigResolveService,
            collections: CollectionsResolveService,
            urls: UrlsResolveService,
            shops: ShopsResolveService,
        }
    },
    {
        path: 'create',
        component: DealCreatorComponent,
        resolve: {
            config: ConfigResolveService,
            Deals: DealsResolveService,
            categories: CategoriesResolveService,
            urls: UrlsResolveService,

        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditDealComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            styleId: IdResolveService,
            urls: UrlsResolveService
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteDealComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            DealId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsDealsRoutingModule { }
