import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';

/*
 *  Quyền hạn
 * */
export interface Permission {
  hasChildren: boolean;
  menuName: string;
  code: string;
  fatherId: number;
  id: number;
  menuGrade: number; // Cấp độ
  permissionVo: Permission[];
  isOpen?: boolean; // Có gập lại không
  checked: boolean;
}

// Giao diện tham số quyền cập nhật
export interface PutPermissionParam {
  permCodes: string[];
  roleId: number;
}

/*
 * nhân vật
 * */
export interface Role {
  id?: number;
  roleName: string;
  roleDesc?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  http = inject(BaseHttpService);

  public getRoles(param: SearchCommonVO<Role>): Observable<PageInfo<Role>> {
    return this.http.post('/role/list', param, { showLoading: true, loadingText: 'Đang yêu cầu' });
  }

  public getRolesDetail(id: number): Observable<Role> {
    return this.http.get(`/role/${id}`);
  }

  public addRoles(param: Role): Observable<void> {
    return this.http.post('/role/create', param, { needSuccessInfo: true });
  }

  public delRoles(ids: number[]): Observable<void> {
    return this.http.post('/role/del', { ids }, { needSuccessInfo: true });
  }

  public editRoles(param: Role): Observable<void> {
    return this.http.put('/role/update', param, { needSuccessInfo: true });
  }

  public getPermissionById(id: string): Observable<string[]> {
    return this.http.get(`/permission/list-role-resources/${id}`);
  }

  public updatePermission(param: PutPermissionParam): Observable<NzSafeAny> {
    return this.http.post('/permission/assign-role-menu', param);
  }
}
