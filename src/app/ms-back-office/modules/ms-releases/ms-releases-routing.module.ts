import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { DeleteReleaseComponent } from './components/delete-release/delete-release.component';
import { EditReleaseComponent } from './components/edit-release/edit-release.component';
import { NewReleaseComponent } from './components/new-release/new-release.component';
import { ReleasesTableComponent } from './components/releases-table/releases-table.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { ShopsResolveService } from '../ms-shops/services/shops-resolve.service';
import { CollectionsResolveService } from '../ms-collections/services/collections-resolve.service';
import { ReleaseAllImagesResolveService } from './services/releases-images-resolve.service';
import { StylesResolveService } from '../ms-style/services/styles-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';
import { ReleasesResolveService } from './services/releases-resolve.service';
import { ReleaseIdResolveService } from './services/releases-id-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: ReleasesTableComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService,
            collections: CollectionsResolveService,
            styles: StylesResolveService,
            shops: ShopsResolveService,
        }
    },
    {
        path: 'create',
        component: NewReleaseComponent,
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            categories: CategoriesResolveService,
            collections: CollectionsResolveService,
            styles: StylesResolveService,
            shops: ShopsResolveService,
            release: ReleaseIdResolveService
        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditReleaseComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            releaseId: IdResolveService,
            brands: BrandsResolveService,
            collections: CollectionsResolveService,
            releaseAllImages: ReleaseAllImagesResolveService,
            categories: CategoriesResolveService,
            styles: StylesResolveService,
            shops: ShopsResolveService,
            releases: ReleasesResolveService
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteReleaseComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            releaseId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsReleasesRoutingModule { }
