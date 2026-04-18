import { Directive, inject, input } from '@angular/core';

import { NzModalComponent } from 'ng-zorro-antd/modal';

import { ModalResizeConfig, ModalResizeService } from './modal-resize.service';

/**
 * Hộp thoại có thể đổi kích thước
 *
 * @example
 * ``` html
 * <nz-modal nzxModalResize></nz-modal>
 * <nz-modal nzxModalResize [nzxResizeConfig]="{minWidth: 500, minHeight: 400}"></nz-modal>
 * ```
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'nz-modal[nzxModalResize]',
})
export class ModalResizeDirective {
  readonly nzxResizeConfig = input<ModalResizeConfig>();

  modalResizeService = inject(ModalResizeService);
  protected modal = inject(NzModalComponent, { host: true });

  constructor() {
    this.modal.afterOpen.subscribe(() => {
      const modalElement = this.modal.getElement()!;
      if (!modalElement) {
        return;
      }

      // Tạo tên lớp duy nhất
      const wrapCls = `modal-resize-${Date.now()}-${Math.random().toString().replace('0.', '')}`;
      modalElement.classList.add(wrapCls);

      // Tạo tay cầm điều chỉnh kích thước
      this.modalResizeService.createResizeHandlers(wrapCls, this.nzxResizeConfig());

      this.modal.afterClose.subscribe(() => {
        this.modalResizeService.dispose();
      });
    });
  }
}
