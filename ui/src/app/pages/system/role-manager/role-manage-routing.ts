import { Route } from '@angular/router';

import { ActionCode } from '@config/actionCode';

import { RoleManageComponent } from './role-manage.component';
import { SetRoleComponent } from './set-role/set-role.component';

export default [
  {
    path: '',
    component: RoleManageComponent,
    title: 'Quản lý vai trò',
    data: { key: 'role-manage' }
  },
  {
    path: 'set-role',
    component: SetRoleComponent,
    title: 'Quản lý vai trò',
    data: {
      key: 'set-role',
      authCode: ActionCode.RoleManagerSetRole
    }
  }
] satisfies Route[];
