import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DateFormat } from '@shared/pipes/map.pipe';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, NzDescriptionsModule, NzTagModule, DatePipe]
})
export class AboutComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Về',
    breadcrumb: ['Trang chủ', 'Mở rộng chức năng', 'Về'],
    desc: 'ng-antd-admin là dựa trênAngularvàng-zorroGiải pháp back-end, mục tiêu là phát triển cho các dự án vừa và lớn, cung cấp các giải pháp sẵn sàng sử dụng và các ví dụ phong phú, không giới hạn bất kỳ mã nào để sử dụng thương mại'
  };
  data = new Date();
  dateFormat = DateFormat.DateTime;
}
