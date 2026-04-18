import { Component, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { DemoCssTransitionComponent } from './demo-css-transition/demo-css-transition.component';
import { DemoEnterLeaveComponent } from './demo-enter-leave/demo-enter-leave.component';
import { DemoStaggerComponent } from './demo-stagger/demo-stagger.component';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrl: './transition.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzTabsModule, DemoCssTransitionComponent, DemoEnterLeaveComponent, DemoStaggerComponent]
})
export class TransitionComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ hoạt hình',
    desc: 'https://angular.dev/guide/animations/migration Dựa trên CSS hoạt hình gốc Angular Phương thức được chính thức đề xuất, phiên bản cũ@angular/animations Được đánh dấu là lỗi thời, nóanimationsHoạt hình, vui lòng tham khảov20Các ví dụ mã của các phiên bản trở xuống vẫn rất phong phú',
    breadcrumb: ['Trang chủ', 'Thành phần', 'hoạt hình']
  };
}
