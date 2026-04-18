import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TabService } from '@core/services/common/tab.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceCompactComponent } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, NzAlertModule, NzButtonModule, NzInputModule, NzWaveModule, NzSpaceCompactComponent]
})
export class TabsComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ về thao tác tab, nếu cần ở hiện tạitabHiển thị trangChi tiết，xin vui lòng ở"Trang danh sách>Bảng tra cứu"Nhấp vào nút xem bảng trong để xem hiệu ứng trình diễn',
    breadcrumb: ['Trang chủ', 'Chức năng mở rộng', 'Ví dụ về thao tác trên trang thẻ']
  };
  private msg = inject(NzMessageService);
  private tabService = inject(TabService);
  private router = inject(Router);

  changeTabTitle(title: string): void {
    this.tabService.changeTabTitle(title);
  }

  closeRight(): void {
    this.tabService.delRightTab(this.router.url, this.tabService.getCurrentTabIndex());
  }
  closeLeft(): void {
    this.tabService.delLeftTab(this.router.url, this.tabService.getCurrentTabIndex());
  }

  closeOther(): void {
    this.tabService.delOtherTab(this.router.url, this.tabService.getCurrentTabIndex());
  }

  closeCurrent(): void {
    const tabArray = this.tabService.getTabArray();
    if (tabArray.length > 1) {
      this.tabService.delTab(tabArray[this.tabService.getCurrentTabIndex()], this.tabService.getCurrentTabIndex());
    } else {
      this.msg.warning('Đây là thẻ cuối cùng, không thể đóng');
    }
  }

  openDetailPage(i: number): void {
    this.router.navigate(['default/feat/tabs/example-detail'], { queryParams: { id: i } });
  }

  refresh(): void {
    this.tabService.refresh();
  }
}
