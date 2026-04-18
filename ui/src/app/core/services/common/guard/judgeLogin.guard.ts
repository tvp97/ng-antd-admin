import { assertInInjectionContext, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { TokenKey } from '@config/constant';

import { WindowService } from '../window.service';

// Ai hứng thú có thể xem quaclassvớifntranh cãihttps://github.com/angular/angular/pull/47924
// Tôi ở đây cung cấp vớijudgeAuth.guard.tsCác cách viết khác nhau, để mọi người tham khảo,Cũng có thể lên trang web chính thức để tìm.mapToCanActivate Cái nàyapi，
// Vệ sĩ định tuyến, không cóTokenKeythì chuyển sang trang đăng nhập
const canActivateChildFn: CanActivateFn = () => {
  // Phương pháp này có thể kiểm trainjectCó đang ởcontextTrung
  assertInInjectionContext(canActivateChildFn);
  const windowSrc = inject(WindowService);
  const router = inject(Router);

  const isLogin = !!windowSrc.getSessionStorage(TokenKey);
  if (isLogin) {
    return true;
  }
  return router.parseUrl('/login');
};

export const JudgeLoginGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return canActivateChildFn(childRoute, state);
};
