import { Route } from '@angular/router';

export default [
  {
    path: '',
    title: 'View Transitions',
    data: {
      key: 'transitions',
      shouldDetach: 'no' // Vô hiệu hóa tái sử dụng định tuyến
    },
    loadComponent: () => import('./transitions').then(m => m.Transitions)
  },
  {
    path: 'transitions-detail',
    title: 'View Transitions',
    data: {
      key: 'transitions-detail',
      shouldDetach: 'no' // Vô hiệu hóa tái sử dụng định tuyến
    },
    loadComponent: () => import('./transitions-detail').then(m => m.TransitionsDetail)
  }
] satisfies Route[];
