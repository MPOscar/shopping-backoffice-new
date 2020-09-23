import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BackOfficeComponent } from '../../components/back-office/back-office.component';

const routes: Routes = [
    {
        path: '',
        component: BackOfficeComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'offers',
                loadChildren: '../ms-offers/ms-offers.module#MsOffersModule'
            },
            {
                path: 'home',
                loadChildren: '../home/home.module#HomeModule'
            },
            {
                path: 'styles',
                loadChildren: '../ms-style/ms-style.module#MsStyleModule'
            },
            {
                path: 'brands',
                loadChildren: '../ms-brands/ms-brands.module#MsBrandsModule'
            },
            {
                path: 'collections',
                loadChildren: '../ms-collections/ms-collections.module#MsCollectionsModule'
            },
            {
                path: 'shops',
                loadChildren: '../ms-shops/ms-shops.module#MsShopsModule'
            },
            {
                path: 'categories',
                loadChildren: '../ms-categories/ms-categories.module#MsCategoriesModule'
            },
            {
                path: 'users',
                loadChildren: '../ms-users/ms-users.module#MsUsersModule'
            },
            {
                path: 'releases',
                loadChildren: '../ms-releases/ms-releases.module#MsReleasesModule'
            },
            {
                path: 'blogs',
                loadChildren: '../ms-blogs/ms-blogs.module#MsBlogsModule'
            },
            {
                path: 'deals',
                loadChildren: '../ms-deals/ms-deals.module#MsDealsModule'
            },
            {
                path: 'urls',
                loadChildren: '../ms-urls/ms-urls.module#MsUrlsModule'
            },
            {
                path: 'tasks',
                loadChildren: '../ms-tasks/ms-tasks.module#MsTasksModule'
            },
            {
                path: 'layouts',
                loadChildren: '../ms-layout/ms-layout.module#MsLayoutModule'
            }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsBackOfficeRoutingModule { }
