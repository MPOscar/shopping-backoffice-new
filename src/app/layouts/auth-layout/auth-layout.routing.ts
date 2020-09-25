import { Routes } from '@angular/router';

import { LoginComponent } from '../../authentication/components/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import {ConfigResolveService} from '../../config/services/config-resolve.service';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',
      component: LoginComponent,
      resolve: {
        config: ConfigResolveService
      }
    },
    { path: 'register',       component: RegisterComponent }
];
