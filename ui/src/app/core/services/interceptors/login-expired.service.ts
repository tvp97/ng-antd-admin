import { HttpClient, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, finalize, share, switchMap } from 'rxjs/operators';

import { TokenKey, loginTimeOutCode, tokenErrorCode } from '@config/constant';
import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { ModalBtnStatus } from '@widget/base-modal';
import { LoginModalService } from '@widget/biz-widget/login/login-modal.service';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { WindowService } from '../common/window.service';

@Injectable()
export class LoginExpiredService implements HttpInterceptor {
  private refresher: Observable<NzSafeAny> | null = null;
  destroyRef = inject(DestroyRef);
  loginModalService = inject(LoginModalService);
  router = inject(Router);
  loginInOutService = inject(LoginInOutService);
  message = inject(NzMessageService);
  windowServe = inject(WindowService);
  http = inject(HttpClient);

  intercept(req: HttpRequest<string>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    const newReq = req.clone();
    return next.handle(newReq).pipe(
      filter(e => e.type !== 0),
      this.loginExpiredFn(newReq, next)
    );
  }

  private sendRequest(request: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<NzSafeAny> | null {
    return this.refresher!.pipe(
      switchMap(() => {
        const token = this.windowServe.getSessionStorage(TokenKey);
        let httpConfig = {};
        if (token) {
          httpConfig = { headers: request.headers.set(TokenKey, token) };
        }
        this.refresher = null;
        const copyReq = request.clone(httpConfig);
        return next.handle(copyReq).pipe(finalize(() => (this.refresher = null)));
      }),
      finalize(() => (this.refresher = null))
    );
  }

  private loginOut(): void {
    this.loginInOutService.loginOut();
    this.refresher = null;
    this.router.navigateByUrl('/login/login-form');
  }

  // Chặn đăng nhập quá thời gian
  private loginExpiredFn(req: HttpRequest<string>, next: HttpHandler): NzSafeAny {
    return switchMap((event: HttpResponse<NzSafeAny>): NzSafeAny => {
      if (event.type !== HttpEventType.Response || event.body.code !== loginTimeOutCode) {
        return of(event);
      }
      if (event.body.code === tokenErrorCode) {
        this.loginOut();
        return;
      }

      if (this.refresher) {
        return this.sendRequest(req, next);
      }

      this.refresher = new Observable(observer => {
        // setTimeoutĐể giải quyết khi làm mới trang, vìzorroKiểu chưa được tải, hộp thoại đăng nhập sẽ nhấp nháy
        setTimeout(() => {
          this.loginModalService
            .show({ nzTitle: 'Thông tin đăng nhập đã hết hạn, vui lòng đăng nhập lại' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ modalValue: token, status }) => {
              if (status === ModalBtnStatus.Cancel) {
                // Làm như vậy là để trong trạng thái đăng nhậptokenHết hạn, làm mới trang, nhấn vào cửa sổ đăng nhậpHuỷ, cần phải ởstartUplấy trongmenuHoàn thành giao diện,
                // Không thì sẽ không vào đượcangularỨng dụng, định tuyến không chuyển hướng
                observer.next(
                  new HttpResponse({
                    body: {
                      code: 3013,
                      msg: 'HuVui lòng đăng nhập lại',
                      data: null
                    }
                  })
                );
                this.loginOut();
                return;
              }
              this.loginInOutService.loginIn(token).then();
              this.http
                .request(req)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                  next: (data: NzSafeAny) => {
                    this.refresher = null;
                    observer.next(data);
                  },
                  error: () => {
                    // Nếu trước tiên dùngadminĐăng nhập hệ thống,tokenHiện ra hộp đăng nhập khi vượt quá thời gian, lúc này lại đang đăng nhập lànormalTài khoản, không có quyền truy cập trang mục tiêu, thìQuay lạiTrang đăng nhập
                    // Ở đây dựa vào phần backend để xác định cái mớitokenKhông có quyền, yêu cầu báo lỗi403
                    this.message.error('Bạn không có quyền truy cập module này');
                    this.loginOut();
                  }
                });
            });
        }, 100);
      }).pipe(
        share(),
        finalize(() => (this.refresher = null))
      );
      return this.refresher;
    });
  }
}
