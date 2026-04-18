import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import vi from '@angular/common/locales/vi';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZonelessChangeDetection,
  inject,
  provideAppInitializer,
  EnvironmentProviders,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRouter, RouteReuseStrategy, TitleStrategy, withComponentInputBinding, withHashLocation, withInMemoryScrolling, withPreloading, withViewTransitions } from '@angular/router';

import { DashboardOutline, FormOutline, MenuFoldOutline, MenuUnfoldOutline } from '@ant-design/icons-angular/icons';
import { appRoutes } from '@app/app.routes';
import { CustomPageTitleResolverService } from '@core/services/common/custom-page-title-resolver.service';
import { InitThemeService } from '@core/services/common/init-theme.service';
import { LoadAliIconCdnService } from '@core/services/common/load-ali-icon-cdn.service';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { SelectivePreloadingStrategyService } from '@core/services/common/selective-preloading-strategy.service';
import { SubLockedStatusService } from '@core/services/common/sub-locked-status.service';
import { SubWindowWithService } from '@core/services/common/sub-window-with.service';
import { ThemeSkinService } from '@core/services/common/theme-skin.service';
import { httpInterceptorService } from '@core/services/interceptors/http-interceptor';
import { StartupService } from '@core/startup/startup.service';
import { getDeepReuseStrategyKeyFn } from '@utils/tools';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ViewTransitionService } from '@core/services/common/view-transition.service';

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];

registerLocaleData(vi);

export function StartupServiceFactory(startupService: StartupService) {
  return () => startupService.load();
}

export function LoadAliIconCdnFactory(loadAliIconCdnService: LoadAliIconCdnService) {
  return () => loadAliIconCdnService.load();
}

export function InitThemeServiceFactory(initThemeService: InitThemeService) {
  return async (): Promise<void> => await initThemeService.initTheme();
}

// Lắng nghe trạng thái khóa màn hình
export function InitLockedStatusServiceFactory(subLockedStatusService: SubLockedStatusService) {
  return () => subLockedStatusService.initLockedStatus();
}

// Bật nghe theo độ rộng màn hình
export function SubWindowWithServiceFactory(subWindowWithService: SubWindowWithService) {
  return () => subWindowWithService.subWindowWidth();
}

const APPINIT_PROVIDES: EnvironmentProviders[] = [
  // Khởi động dự án
  provideAppInitializer(() => {
    const initializerFn = StartupServiceFactory(inject(StartupService));
    return initializerFn();
  }),
  // loadThư viện biểu tượng Alicdn
  provideAppInitializer(() => {
    const initializerFn = LoadAliIconCdnFactory(inject(LoadAliIconCdnService));
    return initializerFn();
  }),
  // Khởi tạo dịch vụ khóa màn hình
  provideAppInitializer(() => {
    const initializerFn = InitLockedStatusServiceFactory(inject(SubLockedStatusService));
    return initializerFn();
  }),
  // Khởi tạo chủ đề
  provideAppInitializer(() => {
    const initializerFn = InitThemeServiceFactory(inject(InitThemeService));
    return initializerFn();
  }),
  // Khởi tạo dịch vụ lắng nghe độ rộng màn hình
  provideAppInitializer(() => {
    const initializerFn = SubWindowWithServiceFactory(inject(SubWindowWithService));
    return initializerFn();
  }),
  // Khởi tạo chế độ tối hay khôngdefaultmẫucss
  provideAppInitializer(() => {
    const initializerFn = ((themeService: ThemeSkinService) => () => {
      return themeService.loadTheme();
    })(inject(ThemeSkinService));
    return initializerFn();
  })
];

export const appConfig: ApplicationConfig = {
  providers: [
    // không có Zone.js (Zoneless) trong mô hình mới,Angular Không còn phụ thuộc Zone.js Hãy cảm nhận các thao tác không đồng bộ và lỗi. Điều này dẫn đến các tác vụ không đồng bộ gốc (như setTimeout hoặc PromiseLỗi chưa được xử lý sẽ "thoát ra" Angular Phạm vi quản lý.
    provideBrowserGlobalErrorListeners(), // Trong môi trường trình duyệt, thiết lập trình nghe lỗi toàn cục và tự động ghi lại các lỗi chưa được xử lý và Promise Từ chối (rejection) Chuyển tiếp cho Angular của ErrorHandler Tiến hành xử lý thống nhất.
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }, // Tái sử dụng định tuyến
    {
      provide: TitleStrategy, // Tài liệu liên quan:https://dev.to/brandontroberts/setting-page-titles-natively-with-the-angular-router-393j
      useClass: CustomPageTitleResolverService // Khi chuyển đổi tuyến đường tùy chỉnh, trình duyệttitlehiển thị, ởng14Hỗ trợ như trên. Cách sử dụng phiên bản cũ vui lòng xem của tôigithub v16tagMã phiên bản dưới đây
    },
    { provide: NZ_I18N, useValue: vi_VN }, // zorroQuốc tế hóa
    { provide: NZ_ICONS, useValue: icons }, // zorroBiểu tượng
    provideRouter(
      appRoutes, // Bộ định tuyến
      withPreloading(SelectivePreloadingStrategyService), // Tải trước mô-đun tùy chỉnh
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: info => {
          const viewTransitionService = inject(ViewTransitionService);

          viewTransitionService.currentTransition.set(info);
          info.transition.finished.finally(() => {
            viewTransitionService.currentTransition.set(null);
          });

          const fromSource = getDeepReuseStrategyKeyFn(info.from, false);

          if (fromSource === 'refresh-empty') {
            // Làm mớitabHoặc chuyển đổi 'Có hiển thị hay không'tab”Hãy tạm thời vô hiệu hóa hiệu ứng chuyển tiếp, nếu không trangtabThanh sẽ nhấp nháy
            info.transition.skipTransition();
          }
        }
      }), // Chuyển tiếp chuyển đổi định tuyến,ng17Thêm mớiTài liệu tham khảo về tính năng thử nghiệmhttps://netbasal.com/angular-v17s-view-transitions-navigate-in-elegance-f2d48fd8ceda
      withInMemoryScrolling({
        scrollPositionRestoration: 'top'
      }),
      withHashLocation(), // Sử dụng định tuyến băm
      withComponentInputBinding() // Bật ràng buộc tham số định tuyến vào thuộc tính đầu vào của thành phần,ng16Thêm mớiĐặc tính
    ),
    importProvidersFrom(NzDrawerModule, NzModalModule, FormsModule),
    ...APPINIT_PROVIDES, // Trước khi khởi động dự án, cần gọi một loạt phương thức
    provideHttpClient(withInterceptors([httpInterceptorService])),
    provideZonelessChangeDetection() // Mở zoneless
  ]
};
