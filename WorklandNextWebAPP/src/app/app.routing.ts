import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { SimpleLayoutComponent, DefaultLayoutComponent, AppLayoutComponent } from './containers';

import { AuthGuard } from '@app/guard';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: SimpleLayoutComponent,
    data: {
      title: 'Auth'
    },
    children: [
      {
        path: 'login',
        // component: LoginComponent,
        loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule),
        data: {
          title: 'Login Page'
        }
      },
      // {
      //   path: 'register',
      //   // component: RegisterComponent,
      //   loadChildren: () => import('./views/register/register.module').then(m => m.RegisterModule),
      //   data: {
      //     title: 'Register Page'
      //   }
      // }
    ]
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'develop',
        loadChildren: () => import('./views/material/material.module').then(m => m.MaterialModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./views/settings/settings.module').then(m => m.SettingsModule),
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'tenants',
        loadChildren: () => import('./views/tenants/tenants.module').then(m => m.TenantsModule),
      },
      {
        path: 'companies',
        loadChildren: () => import('./views/companies/companies.module').then(m => m.CompaniesModule),
      },
      {
        path: 'roles-permissions',
        loadChildren: () => import('./views/roles-permissions/roles-permissions.module').then(m => m.RolesPermissionsModule),
      },
      {
        path: 'users',
        loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'ddt',
        loadChildren: () => import('./views/ddt/ddt.module').then(m => m.DdtModule),
      },
      {
        path: 'invoices',
        loadChildren: () => import('./views/invoices/invoices.module').then(m => m.InvoicesModule),
      },
      {
        path: 'client-orders',
        loadChildren: () => import('./views/orders/orders.module').then(m => m.OrdersModule),
      },
      {
        path: 'orders-suppliers',
        loadChildren: () => import('./views/orders-suppliers/orders-suppliers.module').then(m => m.OrdersSuppliersModule),
      },
      {
        path: 'quotes',
        loadChildren: () => import('./views/quotes/quotes.module').then(m => m.QuotesModule),
      },
      {
        path: 'tables',
        loadChildren: () => import('./views/tables/tables.module').then(m => m.TablesModule),
      },
      {
        path: 'contacts',
        loadChildren: () => import('./views/contacts/contacts.module').then(m => m.ContactsModule),
      },
      {
        path: 'activities',
        loadChildren: () => import('./views/activities/activities.module').then(m => m.ActivitiesModule),
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
