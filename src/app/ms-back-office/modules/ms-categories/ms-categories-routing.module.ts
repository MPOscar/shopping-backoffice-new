import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { DeleteCategoryComponent } from './components/delete-category/delete-category.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { NewCategoryComponent } from './components/new-category/new-category.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { CategoriesResolveService } from './services/categories-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: CategoriesTableComponent,
        resolve: {
            config: ConfigResolveService
        }
    },
    {
        path: 'create',
        component: NewCategoryComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService

        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditCategoryComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categoryId: IdResolveService
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteCategoryComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            categoryId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsCategoriesRoutingModule { }
