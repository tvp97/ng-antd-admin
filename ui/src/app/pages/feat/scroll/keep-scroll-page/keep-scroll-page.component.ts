import { Component, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-keep-scroll-page',
  templateUrl: './keep-scroll-page.component.html',
  styleUrl: './keep-scroll-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, NzGridModule]
})
export class KeepScrollPageComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Thanh cuộn bộ nhớ đệm',
    breadcrumb: ['Trang chủ', 'Mở rộng chức năng', 'Thanh cuộn bộ nhớ đệm'],
    desc: 'Làm xong2Trời cuối cùng cũng khá hài lòng,Các trang mặc định có thể tái sử dụng sẽ lưu bộ cuộn. Nếu trang đó được thiết lập là không thể tái sử dụng, thì bộ cuộn cũng sẽ không được lưu. Nếu cần một trang có thể tái sử dụng nhưng không lưu bộ cuộn, thì hãy thiết lập trong cấu hình định tuyến.needKeepScrollvìno'
  };
}
