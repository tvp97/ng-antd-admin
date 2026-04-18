import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'analysis', pathMatch: 'full' },
  {
    title: 'Trang phân tích',
    path: 'analysis',
    data: { preload: true, key: 'analysis' },
    loadComponent: () => import('./analysis/analysis.component').then(m => m.AnalysisComponent)
  },
  { path: 'monitor', title: 'Trang giám sát', data: { key: 'monitor' }, loadComponent: () => import('./monitor/monitor.component').then(m => m.MonitorComponent) },
  { path: 'workbench', title: 'Bàn làm việc', data: { key: 'workbench' }, loadComponent: () => import('./workbench/workbench.component').then(m => m.WorkbenchComponent) }
] satisfies Route[];
