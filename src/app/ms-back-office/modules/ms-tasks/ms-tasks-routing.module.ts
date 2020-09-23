import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { TasksTableComponent } from './components/tasks-table/tasks-table.component';
import { DeleteTaskComponent } from './components/delete-task/delete-task.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { UsersResolveService } from '../ms-users/services/users-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: TasksTableComponent,
        resolve: {
            config: ConfigResolveService,
            users: UsersResolveService
        }
    },
    {
        path: 'create',
        component: NewTaskComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            users: UsersResolveService

        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditTaskComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            TaskId: IdResolveService,
            users: UsersResolveService
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteTaskComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            TaskId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsTasksRoutingModule { }
