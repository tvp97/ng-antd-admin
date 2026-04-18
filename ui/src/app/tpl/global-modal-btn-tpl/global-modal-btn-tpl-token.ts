// https://netbasal.com/getting-to-know-the-createcomponent-api-in-angular-22fb115f08e2
// https://angular.io/api/core/createComponent
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, InjectionToken } from '@angular/core';

import { GlobalModalBtnTplComponent } from '@app/tpl/global-modal-btn-tpl/global-modal-btn-tpl.component';

/**
 * Góc trên bên phải hộp thoại toàn cục, mở rộng mẫu chức năng phóng to tối đa
 */
export const GLOBAL_TPL_MODAL_ACTION_TOKEN = new InjectionToken<ComponentRef<GlobalModalBtnTplComponent>>('modal action btn token', {
  providedIn: 'root',
  factory: () => {
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    const componentRef = createComponent(GlobalModalBtnTplComponent, {
      environmentInjector: injector
    });
    // sử dụng `ApplicationRef` để thêm component ref mới được tạo vào chu kỳ kiểm tra thay đổi.
    appRef.attachView(componentRef.hostView);
    return componentRef;
  }
});
