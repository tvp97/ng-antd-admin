import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

/*
 * Tải trước mô-đunservice, Tài liệu tham khảo:https://dev.to/this-is-angular/optimize-your-angular-apps-user-experience-with-preloading-strategies-3ie7
 * */
@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadingStrategyService implements PreloadingStrategy {
  preloadedModules: string[] = []; // Mảng này được sử dụng để ghi lại các mô-đun đã được cấu hình tải trước. Có thể có một số nhu cầu muốn lấy nó.

  preload(route: Route, load: () => Observable<NzSafeAny>): Observable<NzSafeAny> {
    // Cấu hình để lại trong cấu hình định tuyếnpreloadThuộc tính làtrueCác mô-đun sẽ chỉ được tải trước. Thông thường, khi bạn có thể dự đoán được trang mà người dùng sẽ chuyển đến tiếp theo, bạn có thể cấu hình tải trước trang đó. Ví dụ như trang chủ sau khi đăng nhập.
    if (route.data?.['preload'] && route.path != null) {
      this.preloadedModules.push(route.path);
      return load();
    } else {
      return of(null);
    }
  }
}
