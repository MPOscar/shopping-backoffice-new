import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
import { EditPrivacyComponent } from './components/edit-privacy/edit-privacy.component';
//
import { ConfigResolveService } from '../../../config/services/config-resolve.service';
import { BrandsResolveService } from '../ms-brands/services/brands-resolve.service';
import { CategoriesResolveService } from '../ms-categories/services/categories-resolve.service';
import { IdResolveService } from '../../../routing/services/id-resolve.service';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditPrivacyComponent,
        //canActivate: [AuthGuardService],
        resolve: {
            config: ConfigResolveService,
            brands: BrandsResolveService,
            blogId: IdResolveService
        },
        data: { closeRouteCommand: ['../../'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsPrivacyRoutingModule { }
