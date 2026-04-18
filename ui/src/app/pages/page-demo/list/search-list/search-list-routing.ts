import { Route } from '@angular/router';

import { ApplicationComponent } from './application/application.component';
import { ArticleComponent } from './article/article.component';
import { ProjectComponent } from './project/project.component';
import { SearchListComponent } from './search-list.component';

export default [
  {
    path: '',
    component: SearchListComponent,
    data: { key: 'search-list' },
    children: [
      { path: 'article', component: ArticleComponent, title: 'Tìm kiếmDanh sách(bài viết)', data: { key: 'article' } },
      { path: 'project', component: ProjectComponent, title: 'Tìm kiếmDanh sách(dự án)', data: { key: 'project' } },
      { path: 'application', component: ApplicationComponent, title: 'Tìm kiếmDanh sách(ứng dụng)', data: { key: 'application' } }
    ]
  },

  { path: '', redirectTo: '/search-list', pathMatch: 'full' }
] satisfies Route[];
