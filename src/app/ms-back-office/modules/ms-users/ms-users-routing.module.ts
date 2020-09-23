import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { DeleteUserComponent } from './components/delete-user/delete-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
//
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: UsersTableComponent,
        resolve: {
            config: ConfigResolveService
        }
    },
    {
        path: 'create',
        component: NewUserComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService

        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditUserComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            userId: IdResolveService
        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteUserComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            userId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsUsersRoutingModule { }
