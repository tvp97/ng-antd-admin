import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';

/*
 * Quản lý người dùng
 * */
export interface User {
  id: number;
  password: string;
  userName?: string;
  available?: boolean;
  roleName?: string[];
  sex?: 1 | 0;
  telephone?: string;
  mobile?: string | number;
  email?: string;
  lastLoginTime?: Date;
  oldPassword?: string;
  departmentId?: number;
  departmentName?: string;
}

/*
 * Người dùng thay đổi mật khẩu
 * */
export interface UserPsd {
  id: number;
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  http = inject(BaseHttpService);

  public getAccount(param: SearchCommonVO<User>): Observable<PageInfo<User>> {
    return this.http.post('/user/list', param);
  }

  public getAccountDetail(id: number): Observable<User> {
    return this.http.get(`/user/${id}`);
  }

  public getAccountAuthCode(id: number): Observable<string[]> {
    return this.http.get(`/user/auth-code/${id}`);
  }

  public addAccount(param: User): Observable<void> {
    return this.http.post('/user/create', param, { needSuccessInfo: true });
  }

  public delAccount(ids: number[]): Observable<void> {
    return this.http.post('/user/del/', { ids }, { needSuccessInfo: true });
  }

  public editAccount(param: User): Observable<void> {
    return this.http.put('/user/update', param, { needSuccessInfo: true });
  }

  public editAccountPsd(param: UserPsd): Observable<void> {
    return this.http.put('/user/psd', param);
  }
}
