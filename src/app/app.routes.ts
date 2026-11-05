
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'assets',
        loadComponent: () =>
          import('./pages/asset-list/asset-list.component').then(
            (m) => m.AssetListComponent,
          ),
      },
      {
        path: 'assets/new',
        loadComponent: () =>
          import('./pages/asset-form/asset-form.component').then(
            (m) => m.AssetFormComponent,
          ),
      },
      {
        path: 'assets/:id/edit',
        loadComponent: () =>
          import('./pages/asset-form/asset-form.component').then(
            (m) => m.AssetFormComponent,
          ),
      },
      {
        path: 'assets/:id/maintenance',
        loadComponent: () =>
          import('./pages/maintenance/maintenance').then((m) => m.Maintenance),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];