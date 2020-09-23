import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { CollectionCreatorComponent } from './components/collection-creator/collection-creator.component';
import { DeleteCollectionComponent } from './components/delete-collection/delete-collection.component';
import { CollectionsTableComponent } from './components/collections-table/collections-table.component';
import { NewCollectionComponent } from './components/new-collection/new-collection.component';
import { EditCollectionComponent } from './components/edit-collection/edit-collection.component';
//
import { CollectionsResolveService } from './services/collections-resolve.service';
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';
import { ShopsResolveService } from '../ms-shops/services/shops-resolve.service';
import { StylesResolveService } from '../ms-style/services/styles-resolve.service';
import { ReleasesResolveService } from '../ms-releases/services/releases-resolve.service';

const routes: Routes = [
    {
        path: '',
        component: CollectionsTableComponent,
        resolve: {
            brands: BrandsResolveService,
            config: ConfigResolveService,            
            shops: ShopsResolveService,
        }
    },
    {
        path: 'create',
        component: CollectionCreatorComponent,
        resolve: {
            brands: BrandsResolveService,
            config: ConfigResolveService,            
            categories: CategoriesResolveService,
            collections: CollectionsResolveService,
            releases: ReleasesResolveService,
            shops: ShopsResolveService,  
            styles: StylesResolveService,        
        },
        data: { closeRouteCommand: ['../'] }
    },
    {
        path: 'edit/:id',
        component: EditCollectionComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            collectionId: IdResolveService,
            shops: ShopsResolveService,
            collections: CollectionsResolveService,
            releases: ReleasesResolveService,
            styles: StylesResolveService,            
        },
        data: { closeRouteCommand: ['../../'] }
    },
    {
        path: 'delete/:id',
        component: DeleteCollectionComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            collectionId: IdResolveService,
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsCollectionsRoutingModule { }
