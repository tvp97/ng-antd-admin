import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChildFn } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { UserInfoStoreService } from '@store/common-store/userInfo-store.service';
import { fnGetUUID } from '@utils/tools';

import { NzMessageService } from 'ng-zorro-antd/message';

import { Menu } from '../../types';

// Tham khảo tranh luận class vs fn: https://github.com/angular/angular/pull/47924
// Cách viết khác với judgeLogin.guard.ts; xem mapToCanActivate trên doc Angular.
// Khi đổi route: kiểm tra quyền vào trang nghiệp vụ; không đủ quyền → chuyển về đăng nhập.
@Injectable({
  providedIn: 'root'
})
export class JudgeAuthGuardService {
  selMenu: Menu | null = null;
  loginOutService = inject(LoginInOutService);
  router = inject(Router);
  userInfoService = inject(UserInfoStoreService);
  menuStoreService = inject(MenuStoreService);
  message = inject(NzMessageService);
  authCodeArray = computed(() => this.userInfoService.$userInfo().authCode);
  menuNavList = computed(() => this.menuStoreService.$menuArray());

  /** Ghi menu khớp url vào selMenu */
  getMenu(menu: Menu[], url: string): void {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < menu.length; i++) {
      if (url === menu[i].path) {
        this.selMenu = menu[i];
        return;
      } else {
        if (menu[i].children && menu[i].children!.length > 0) {
          this.getMenu(menu[i].children!, url);
        }
      }
    }
  }

  getResult(code: string, authCodeArray: string[]): boolean | UrlTree {
    if (authCodeArray.includes(code)) {
      return true;
    } else {
      this.message.error('Bạn không có quyền truy cập module này');
      this.loginOutService.loginOut();
      return this.router.parseUrl('/login');
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    while (route.firstChild) {
      route = route.firstChild;
    }
    // Có authCode: điều hướng từ nút trên trang, không phải từ menu
    if (route.data['authCode']) {
      return this.getResult(route.data['authCode'], this.authCodeArray());
    }

    this.getMenu(this.menuNavList(), state.url);
    // Không tìm thấy menu → xử lý như không có quyền
    if (!this.selMenu) {
      return this.getResult(fnGetUUID(), this.authCodeArray());
    }
    const selMenuCode = this.selMenu.code;
    this.selMenu = null;
    // Có menu nhưng user không có mã quyền tương ứng
    return this.getResult(selMenuCode!, this.authCodeArray());
  }
}

export const JudgeAuthGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(JudgeAuthGuardService).canActivateChild(childRoute, state);
};
