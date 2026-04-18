import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, ChangeDetectionStrategy, TemplateRef, inject, DestroyRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ModalBtnStatus } from '@widget/base-modal';
import { DragService } from '@widget/biz-widget/drag/drag.service';
import { ModalDragDirective } from '@widget/modal/modal-drag.directive';
import { ModalResizeDirective } from '@widget/modal/modal-resize.directive';
import { NzModalWrapService } from '@widget/modal/nz-modal-wrap.service';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-ex-modal',
  templateUrl: './ex-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzButtonModule, NzWaveModule, NzModalModule, ModalDragDirective, ModalResizeDirective, CdkDrag, CdkDragHandle]
})
export class ExModalComponent {
  readonly dragTpl = viewChild.required<TemplateRef<NzSafeAny>>('dragTpl');
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Kéo Modal — mở rộng trên dialog Zorro',
    breadcrumb: ['Trang chủ', 'Modal kéo thả']
  };
  destroyRef = inject(DestroyRef);
  isVisible = false;
  isVisibleByDir = false;
  isVisibleResize = false;
  isVisibleDragResize = false;

  private dragService = inject(DragService);
  private modalDragService = inject(NzModalWrapService);

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.isVisibleByDir = false;
    this.isVisibleResize = false;
    this.isVisibleDragResize = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.isVisibleByDir = false;
    this.isVisibleResize = false;
    this.isVisibleDragResize = false;
  }

  showDailog1(): void {
    this.isVisible = true;
  }

  showDailogConfirm(): void {
    this.modalDragService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Nội dung thông báo mẫu',
      nzOnOk: () => {
        console.log('Xác nhận');
      },
      nzOnCancel: () => {
        console.log('Huỷ');
      }
    });
  }

  showDailogInfo(): void {
    this.modalDragService.info({ nzTitle: 'Info', nzContent: 'Nội dung thông báo mẫu' });
  }

  showDailogSuccess(): void {
    this.modalDragService.success({ nzTitle: 'Success', nzContent: 'Nội dung thông báo mẫu' });
  }

  showDailogError(): void {
    this.modalDragService.error({ nzTitle: 'Error', nzContent: 'Nội dung thông báo mẫu' });
  }

  showDailogWarning(): void {
    this.modalDragService.warning({ nzTitle: 'Warning', nzContent: 'Nội dung thông báo mẫu' });
  }

  showDailog(): void {
    // Hai cách
    // this.dragService.show({nzTitle: this.dragTpl, nzMask: false,nzMaskStyle:{display:'none'},nzWrapClassName:"pointer-events-none"}).subscribe(res=>console.log(res))
    this.dragService
      .show(
        {
          nzTitle: 'Tiêu đề kéo thả',
          nzMask: false,
          nzMaskStyle: { display: 'none' },
          nzWrapClassName: 'pointer-events-none'
        },
        { title: 'Tham số truyền từ bên ngoài vào hộp thoại' }
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ modalValue, status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        console.log(modalValue);
      });
  }
}
