import { Route } from '@angular/router';

import { DefaultComponent } from './default.component';

export default [
  {
    path: '',
    component: DefaultComponent,
    data: { shouldDetach: 'no', preload: true },
    canActivateChild: [],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        data: { preload: true },
        loadChildren: () => import('../../pages/dashboard/dashboard-routing')
      },
      {
        path: 'page-demo',
        loadChildren: () => import('../../pages/page-demo/page-demo-routing')
      },
      {
        path: 'feat',
        loadChildren: () => import('../../pages/feat/feat-routing.module')
      },
      {
        path: 'comp',
        loadChildren: () => import('../../pages/comp/comp-routing')
      },
      {
        path: 'level',
        loadChildren: () => import('../../pages/level/level-routing')
      },
      {
        path: 'about',
        title: 'Giới thiệu',
        data: { key: 'about' },
        loadComponent: () => import('../../pages/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'system',
        loadChildren: () => import('../../pages/system/system-routing')
      },
      // Đường dẫn này được sử dụng đểtabThành phần giữ chỗ khi làm mới
      {
        path: 'refresh-empty',
        title: 'refresh-empty',
        data: { key: 'refresh-empty', shouldDetach: 'no' },
        loadComponent: () => import('./refresh-empty/refresh-empty.component').then(m => m.RefreshEmptyComponent)
      }
    ]
  }
] satisfies Route[];
