import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { UsersResolveService } from '../ms-users/services/users-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { ShopsResolveService } from '../ms-shops/services/shops-resolve.service';
import { CollectionsResolveService } from '../ms-collections/services/collections-resolve.service';
import { ReleaseAllImagesResolveService } from '../ms-releases/services/releases-images-resolve.service';
import { StylesResolveService } from '../ms-style/services/styles-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';
import { ReleasesResolveService } from '../ms-releases/services/releases-resolve.service';


const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            config: ConfigResolveService,
            users: UsersResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService,
            collections: CollectionsResolveService,
            styles: StylesResolveService,
            shops: ShopsResolveService,
            releases: ReleasesResolveService,
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {}
