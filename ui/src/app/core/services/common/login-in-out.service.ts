import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

import { ActionCode } from '@config/actionCode';
import { TokenKey, TokenPre } from '@config/constant';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { TabService } from '@core/services/common/tab.service';
import { WindowService } from '@core/services/common/window.service';
import { Menu } from '@core/services/types';
import { LoginService } from '@services/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { UserInfo, UserInfoStoreService } from '@store/common-store/userInfo-store.service';
import { fnFlatDataHasParentToTree } from '@utils/treeTableTools';

/*
 * Đăng nhập/Đăng xuất
 * */
@Injectable({
  providedIn: 'root'
})
export class LoginInOutService {
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  private tabService = inject(TabService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private userInfoService = inject(UserInfoStoreService);
  private menuService = inject(MenuStoreService);
  private windowServe = inject(WindowService);

  // Lấy mảng menu thông qua mã quyền mà người dùng sở hữu
  getMenuByUserAuthCode(authCode: string[]): Observable<Menu[]> {
    return this.loginService.getMenuByUserAuthCode(authCode);
  }

  loginIn(token: string): Promise<void> {
    return new Promise(resolve => {
      // sẽ token Bộ nhớ đệm bền vững, xin lưu ý, nếu không có bộ nhớ đệm, nó sẽ bị chặn trong bảo vệ định tuyến và không cho phép chuyển hướng định tuyến
      // Vệ sĩ định tuyến này ởsrc/app/core/services/common/guard/judgeLogin.guard.ts
      this.windowServe.setSessionStorage(TokenKey, TokenPre + token);
      // Phân tíchtoken rồi sau đó lấy thông tin người dùng
      const userInfo: UserInfo = this.userInfoService.parsToken(TokenPre + token);
      // Dựa trên người dùngidLấy mã quyền mà người dùng hiện tại sở hữu
      this.userInfoService
        .getUserAuthCodeByUserId(userInfo.userId)
        .pipe(
          switchMap(autoCodeArray => {
            userInfo.authCode = autoCodeArray;
            // todo  Đây là thủ côngThêmMở trong thao tác thẻ trang tĩnhChi tiếtQuyền của nút, vì chúng liên quan đến chuyển hướng tuyến đường, sẽ đi qua bảo vệ tuyến đường, nhưng quyền lại không được quản lý bởi backend, nên hai dòng dưới đây thực hiện thủ côngThêmQuyền hạn, trong thực tế hoạt động có thểXóadưới đây2Được, nếu bạn cũng có nhu cầu tương tự, xin làm toàn cụcTìm kiếmActionCode.TabsDetail, việc này cần được cấu hình trong router
            userInfo.authCode.push(ActionCode.TabsDetail);
            userInfo.authCode.push(ActionCode.SearchTableDetail);
            // Lưu thông tin người dùng vào bộ nhớ đệm toàn cụcserviceTrung
            this.userInfoService.$userInfo.set(userInfo);
            return this.getMenuByUserAuthCode(userInfo.authCode);
          }),
          finalize(() => {
            resolve();
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(menus => {
          menus = menus.filter(item => {
            item.selected = false;
            item.open = false;
            return item.menuType === 'C';
          });
          const temp = fnFlatDataHasParentToTree(menus);
          // Lưu trữmenu
          this.menuService.setMenuArrayStore(temp);
          resolve();
        });
    });
  }

  // XóaTabBộ nhớ đệm,Là những thứ liên quan đến tái sử dụng định tuyến
  clearTabCash(): Promise<void> {
    return SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot).then(() => {
      return new Promise(resolve => {
        // Xóa sạchtab
        this.tabService.clearTabs();
        resolve();
      });
    });
  }

  clearSessionCash(): Promise<void> {
    return new Promise(resolve => {
      this.windowServe.removeSessionStorage(TokenKey);
      this.menuService.setMenuArrayStore([]);
      resolve();
    });
  }

  loginOut(): Promise<void> {
    this.loginService.loginOut().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    return this.router
      .navigate(['/login/login-form'])
      .then(() => {
        return this.clearTabCash();
      })
      .then(() => {
        return this.clearSessionCash();
      });
  }
}
