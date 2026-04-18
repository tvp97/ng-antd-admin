import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PageHeaderComponent, PageHeaderType } from '@shared/components/page-header/page-header.component';
import { KeepAlive } from '@shared/directives/keep-alive';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-keep-alive',
  imports: [NzButtonComponent, PageHeaderComponent, NzInputDirective, ReactiveFormsModule, KeepAlive],
  templateUrl: './keep-alive.html'
})
export class KeepAliveDemo {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'KeepAlive',
    breadcrumb: ['Trang chủ', 'chức năng', 'keepAlive'],
    desc: 'ngLệnh do chủ nhóm cung cấp, tôi thấy rất hay nên chia sẻ cho mọi người. Bạn nhập trước một số nội dung vào ô nhập liệu, chuyển nút, nội dung trong ô nhập liệu vẫn có thể được giữ lại. Có thể là ô nhập liệu hoặc cũng có thể là biểu mẫu.'
  };

  flag = signal(true);

  go(): void {
    this.flag.set(!this.flag());
  }
}
