import { Directive, inject } from '@angular/core';

import { NzModalComponent } from 'ng-zorro-antd/modal';

import { ModalDragService } from './modal-drag.service';

/**
 * Hộp thoại có thể kéo
 *
 * @example
 * ``` html
 * <nz-modal nzxModalDrag ></nz-modal>
 ```
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'nz-modal[nzxModalDrag]',
})
export class ModalDragDirective {
  modalDragService = inject(ModalDragService);
  protected modal = inject(NzModalComponent, { host: true });

  constructor() {
    const wrapCls = this.modalDragService.getRandomCls();
    // afterOpen/afterClose Mỗi cái chỉ kích hoạt một lần, và do NzModalComponent vòng đời quản lý bản thân,
    // modal Khi hủy bỏ những cái này Observable sẽ tự động completekhông cần takeUntilDestroyed
    this.modal.afterOpen.subscribe(() => {
      const modelElement = this.modal.getElement()!;
      if (!modelElement || modelElement.className.indexOf(ModalDragService.DRAG_CLS_PREFIX) !== -1) {
        return;
      }

      modelElement.classList.add(wrapCls);
      const drag = this.modalDragService.createDragHandler(wrapCls, this.modal.nzModalType);
      this.modal.afterClose.subscribe(() => {
        if (drag && !drag.dropped) {
          drag.dispose();
        }
      });
    });
  }
}
