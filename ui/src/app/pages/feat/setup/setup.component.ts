import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { DriverService } from '@core/services/common/driver.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzButtonModule, NzWaveModule]
})
export class SetupComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Trang dẫn hướng',
    breadcrumb: ['Trang chủ', 'Trang dẫn hướng'],
    desc: 'Dùng để hướng dẫn thao tác cho người dùng'
  };

  private driverService = inject(DriverService);

  go(): void {
    this.driverService.load();
  }
}
