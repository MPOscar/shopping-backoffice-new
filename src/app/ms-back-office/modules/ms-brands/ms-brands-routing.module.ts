import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { BrandsTableComponent } from './components/brands-table/brands-table.component';
import { BrandCreatorComponent } from './components/brand-creator/brand-creator.component';
import { DeleteBrandComponent } from './components/delete-brand/delete-brand.component';
import { EditBrandComponent } from './components/edit-brand/edit-brand.component';
import { NewBrandComponent } from './components/new-brand/new-brand.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from './services/brands-resolve.service';
import { CollectionsResolveService } from '../ms-collections/services/collections-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';
import { ShopsResolveService } from '../ms-shops/services/shops-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: BrandsTableComponent,
        resolve: {
            config: ConfigResolveService,
            collections: CollectionsResolveService,
            shops: ShopsResolveService
        }
    },
    {
        path: 'create',
        component: BrandCreatorComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService,
            shops: ShopsResolveService

        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditBrandComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            styleId: IdResolveService,
            shops: ShopsResolveService
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteBrandComponent,
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
export class MsBrandsRoutingModule { }
