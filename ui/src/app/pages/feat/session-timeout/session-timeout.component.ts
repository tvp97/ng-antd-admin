import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ExampleService } from '@services/example/example.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzButtonModule, NzWaveModule]
})
export class SessionTimeoutComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Đăng nhập hết hạn',
    breadcrumb: ['Trang chủ', 'chức năng', 'Đăng nhập hết hạn'],
    desc: 'Ví dụ đăng nhập người dùng hết thời gian. NếuredisNếu vượt quá thời gian, thì sẽ hiển thị lại hộp đăng nhập, đăng nhập thành công thì sẽ gửi lại giao diện ban đầu.' + 'Đăng nhập thất bại, thì chuyển đến trang đăng nhập.'
  };
  destroyRef = inject(DestroyRef);

  private dataService = inject(ExampleService);

  go(): void {
    this.dataService.sessionTimeOut().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
