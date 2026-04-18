import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { localUrl } from '@env/environment.prod';
import * as qs from 'qs';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface HttpCustomConfig {
  needSuccessInfo?: boolean; // Có cần không"Thao tác thành công"Thông báo
  showLoading?: boolean; // Có cần khôngloading
  otherUrl?: boolean; // Có phải là giao diện bên thứ ba không
  loadingText?: string; // Tùy chọn: Tùy chỉnhLoadingBản sao quảng cáo
}

export interface ActionResult<T> {
  code: number;
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  uri: string;
  http = inject(HttpClient);
  message = inject(NzMessageService);

  protected constructor() {
    this.uri = environment.production ? localUrl : '/site/api';
  }

  get<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });

    // Lấy đóngloadinghàm gọi lại
    const closeLoading = this.handleLoading(config);

    return this.http.get<ActionResult<T>>(reqPath, { params }).pipe(
      finalize(closeLoading), // Dù thành công hay thất bại, logic đóng sẽ được gọi ngay khi kết thúc giao diện
      this.resultHandle<T>(config)
    );
  }

  delete<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });

    const closeLoading = this.handleLoading(config);

    return this.http.delete<ActionResult<T>>(reqPath, { params }).pipe(
      finalize(closeLoading), // Dù thành công hay thất bại, logic đóng sẽ được gọi ngay khi kết thúc giao diện
      this.resultHandle<T>(config)
    );
  }

  post<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);

    const closeLoading = this.handleLoading(config);

    return this.http.post<ActionResult<T>>(reqPath, param).pipe(
      finalize(closeLoading), // Dù thành công hay thất bại, logic đóng sẽ được gọi ngay khi kết thúc giao diện
      this.resultHandle<T>(config)
    );
  }

  put<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);

    const closeLoading = this.handleLoading(config);

    return this.http.put<ActionResult<T>>(reqPath, param).pipe(
      finalize(closeLoading), // Dù thành công hay thất bại, logic đóng sẽ được gọi ngay khi kết thúc giao diện
      this.resultHandle<T>(config)
    );
  }

  downLoadWithBlob(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<NzSafeAny> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);

    const closeLoading = this.handleLoading(config);

    return this.http
      .post(reqPath, param, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      })
      .pipe(finalize(closeLoading));
  }

  getUrl(path: string, config: HttpCustomConfig): string {
    let reqPath = this.uri + path;
    if (config.otherUrl) {
      reqPath = path;
    }
    return reqPath;
  }

  /**
   * LoadingXử lý logic
   * Ngay cả giao diện trong chốc látQuay lại，Loading Cũng sẽ kiên trì trình bày ít nhất 500ms
   */
  private handleLoading(config: HttpCustomConfig): () => void {
    if (config.showLoading) {
      const startTime = Date.now();
      // Chú ý: Cài đặt nzDuration: 0 Để tắt bằng tay, nếu không sẽ bị mặc định 3000ms Tự động loại bỏ nhiễu logic
      const msgRef = this.message.loading(config.loadingText || 'Đang tải...', { nzDuration: 0 });

      return () => {
        const elapsed = Date.now() - startTime;
        const minDuration = 500; // Hiển thị tối thiểu 500ms
        const remaining = minDuration - elapsed;

        if (remaining > 0) {
          // Nếu yêu cầu quá nhanh (ví dụ 50ms）、thì trì hoãn 450ms sau đó loại bỏ Loading
          // Lúc này dữ liệu đãQuay lạiĐã cho trang, nhưng Loading Vẫn ở
          setTimeout(() => {
            this.message.remove(msgRef.messageId);
          }, remaining);
        } else {
          // Nếu yêu cầu tự nó đã rất chậm (quá 500ms）, ngay lập tức gỡ bỏ
          this.message.remove(msgRef.messageId);
        }
      };
    }
    return () => {};
  }

  resultHandle<T>(config: HttpCustomConfig): (observable: Observable<ActionResult<T>>) => Observable<T> {
    return (observable: Observable<ActionResult<T>>) => {
      return observable.pipe(
        filter(item => {
          return this.handleFilter(item, !!config.needSuccessInfo);
        }),
        map(item => {
          if (![200, 201].includes(item.code)) {
            throw new Error(item.msg);
          }
          return item.data;
        })
      );
    };
  }

  handleFilter<T>(item: ActionResult<T>, needSuccessInfo: boolean): boolean {
    if (![200, 201].includes(item.code)) {
      this.message.error(item.msg);
    } else if (needSuccessInfo) {
      this.message.success('Thao tác thành công');
    }
    return true;
  }
}
