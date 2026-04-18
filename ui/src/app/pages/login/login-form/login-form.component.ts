import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { LoginService } from '@core/services/http/login/login.service';
import { SpinService } from '@store/common-store/spin.service';
import { fnCheckForm } from '@utils/tools';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzTabsModule, NzGridModule, NzButtonModule, NzInputModule, NzWaveModule, NzCheckboxModule, NzIconModule, RouterLink]
})
export class LoginFormComponent implements OnInit {
  validateForm!: FormGroup;
  destroyRef = inject(DestroyRef);

  private fb = inject(FormBuilder);
  private notification = inject(NzNotificationService);
  private router = inject(Router);
  private spinService = inject(SpinService);
  private dataService = inject(LoginService);
  private loginInOutService = inject(LoginInOutService);

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.spinService.$globalSpinStore.set(true);
    const param = this.validateForm.getRawValue();
    // Gọi API đăng nhập. Định dạng response thống nhất: code !== 200 bị interceptor xử lý — chỉnh tại base-http.service.ts nếu cần
    // {
    //   code:number,
    //   data:NzSafeAny,
    //   msg：string
    // }
    this.dataService
      .login(param)
      .pipe(
        finalize(() => {
          this.spinService.$globalSpinStore.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(userToken => {
        // Backend trả token JWT; loginIn parse và lưu
        this.loginInOutService
          .loginIn(userToken)
          .then(() => {
            this.router.navigateByUrl('default/dashboard/analysis');
          })
          .finally(() => {
            this.spinService.$globalSpinStore.set(false);
            // this.notification.blank(
            //   'Thông báo',
            //   `
            //    Mã nguồn：<a href="https://github.com/huajian123/ng-antd-admin">Tại dây</a>
            // `,
            //   {
            //     nzPlacement: 'top',
            //     nzDuration: 0
            //   }
            // );
          });
      });
  }

  ngOnInit(): void {
    // Vào trang đăng nhập: xóa cache / phiên cũ
    this.loginInOutService.loginOut();
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [null]
    });
  }
}
