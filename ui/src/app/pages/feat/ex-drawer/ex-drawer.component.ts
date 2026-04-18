import { Component, ChangeDetectionStrategy, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { ExDrawerDrawerService } from '@app/drawer/biz-drawer/ex-drawer-drawer/ex-drawer-drawer.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ModalBtnStatus } from '@widget/base-modal';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-ex-drawer',
  templateUrl: './ex-drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzInputModule, FormsModule, NzButtonModule, NzWaveModule]
})
export class ExDrawerComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Đóng gói ngăn kéo',
    breadcrumb: ['Trang chủ', 'Đóng gói ngăn kéo'],
    desc: 'Trong ngăn kéo nhỏ bé ấy chứa đựng biết bao nhiêu ước mơ lớn của tôi'
  };
  data = '';
  dataFromDrawer = signal('');
  destroyRef = inject(DestroyRef);
  private drawerService = inject(ExDrawerDrawerService);

  showDrawer(): void {
    this.drawerService
      .show({ nzTitle: 'Tạo dịch vụ' }, { name: this.data })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ modalValue, status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        this.dataFromDrawer.set(modalValue.password);
      });
  }
}
