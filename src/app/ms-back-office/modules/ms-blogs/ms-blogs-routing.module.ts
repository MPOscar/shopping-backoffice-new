import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { BlogsTableComponent } from './components/blogs-table/blogs-table.component';
import { DeleteBlogComponent } from './components/delete-blog/delete-blog.component';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';
import { NewBlogComponent } from './components/new-blog/new-blog.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { BlogsAllImagesResolveService } from './services/blogs-images-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: BlogsTableComponent,
        resolve: {
            brands: BrandsResolveService,
            config: ConfigResolveService
        }
    },
    {
        path: 'create',
        component: NewBlogComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService

        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditBlogComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            blogId: IdResolveService,
            blogAllImages: BlogsAllImagesResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteBlogComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            blogId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsBlogsRoutingModule { }
