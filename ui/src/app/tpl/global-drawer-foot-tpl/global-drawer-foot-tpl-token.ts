// https://netbasal.com/getting-to-know-the-createcomponent-api-in-angular-22fb115f08e2
// https://angular.io/api/core/createComponent
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, InjectionToken } from '@angular/core';

import { GlobalDrawerFootTplComponent } from '@app/tpl/global-drawer-foot-tpl/global-drawer-foot-tpl.component';

/**
 * ngăn kéo toàn cụcfooterMẫu, tức làXác nhận，Hubấm nút đi
 */
export const GLOBAL_DRAWER_FOOT_TPL_TOKEN = new InjectionToken<ComponentRef<GlobalDrawerFootTplComponent>>('drawer action btn token', {
  providedIn: 'root',
  factory: () => {
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    const componentRef = createComponent(GlobalDrawerFootTplComponent, {
      environmentInjector: injector
    });
    // sử dụng `ApplicationRef` để thêm component ref mới được tạo vào chu kỳ kiểm tra thay đổi.
    appRef.attachView(componentRef.hostView);
    return componentRef;
  }
});
