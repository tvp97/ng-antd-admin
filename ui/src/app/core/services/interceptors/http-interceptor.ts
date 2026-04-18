import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { TokenKey } from '@config/constant';
import { WindowService } from '@core/services/common/window.service';

interface CustomHttpConfig {
  headers?: HttpHeaders;
}

function handleError(error: HttpErrorResponse): Observable<never> {
  const status = error.status;
  let errMsg = '';
  if (status === 0) {
    errMsg = 'Mạng xuất hiện lỗi không xác định, vui lòng kiểm tra mạng của bạn.';
  }
  if (status >= 300 && status < 400) {
    errMsg = `Yêu cầu đã bị máy chủ chuyển hướng, mã trạng thái là${status}`;
  }
  if (status >= 400 && status < 500) {
    errMsg = `Lỗi phía khách hàng, có thể dữ liệu gửi đi không chính xác, mã trạng thái là${status}`;
  }
  if (status >= 500) {
    errMsg = `Máy chủ gặp lỗi, mã trạng thái là${status}`;
  }

  return throwError(() => {
    return {
      code: status,
      message: errMsg
    };
  });
}

export const httpInterceptorService: HttpInterceptorFn = (req, next) => {
  const windowServe = inject(WindowService);
  const token = windowServe.getSessionStorage(TokenKey);
  let httpConfig: CustomHttpConfig = {};
  if (token) {
    httpConfig = { headers: req.headers.set(TokenKey, token) };
  }
  const copyReq = req.clone(httpConfig);
  return next(copyReq).pipe(
    filter(e => e.type !== 0),
    catchError(error => handleError(error))
  );
};
