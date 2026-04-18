import { Route } from '@angular/router';

import { ActionCode } from '@config/actionCode';

export default [
  { path: '', title: 'Thao tác tab', data: { key: 'tabs' }, loadComponent: () => import('./tabs.component').then(m => m.TabsComponent) },
  {
    path: 'example-detail',
    title: 'Trình diễnChi tiết',
    data: { newTab: 'true', authCode: ActionCode.TabsDetail, key: 'example-detail' },
    loadComponent: () => import('./detail/detail.component').then(m => m.DetailComponent)
  }
] satisfies Route[];
