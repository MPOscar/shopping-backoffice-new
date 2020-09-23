import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StyleTableComponent } from './components/styles-table/styles-table.component';
import { NewStyleComponent } from './components/new-style/new-style.component';
import { EditStyleComponent } from './components/edit-style/edit-style.component';
import { DeleteStyleComponent } from './components/delete-style/delete-style.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { StylesResolveService } from './services/styles-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';
import { ShopsResolveService } from '../ms-shops/services/shops-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: StyleTableComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService,
            styles: StylesResolveService,
        }
    },
    {
        path: 'create',
        component: NewStyleComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService,
            styles: StylesResolveService,
            shops: ShopsResolveService,
        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditStyleComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            styleId: IdResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService,
            styles: StylesResolveService,
            shops: ShopsResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteStyleComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            styleId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsStyleRoutingModule { }
