import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent, PageHeaderType } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';

@Component({
  selector: 'app-water-mark-demo',
  imports: [PageHeaderComponent, WaterMarkComponent],
  templateUrl: './water-mark.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaterMarkDemoComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Dấu chìm',
    breadcrumb: ['Trang chủ', 'chức năng', 'Dấu chìm'],
    desc: 'Có thể tự đóng gói thành phần watermark, cũng có thể sử dụngzorroTrang web chính thức, ví dụ,https://ng.ant.design/components/water-mark/zh'
  };
}
