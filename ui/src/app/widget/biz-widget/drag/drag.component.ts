import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BasicConfirmModalComponent } from '@widget/base-modal';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

/**
 * Đây là một dữ liệu được truyền từ bên ngoài vào hộp thoại
 */
export interface DragModalData {
  title: string;
}

@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragComponent extends BasicConfirmModalComponent implements OnInit {
  readonly nzModalData: DragModalData = inject(NZ_MODAL_DATA);
  messageService = inject(NzMessageService);
  override modalRef = inject(NzModalRef);

  override getCurrentValue(): Observable<NzSafeAny> {
    return of(true);
  }

  ngOnInit(): void {
    this.messageService.info(`Đây là một dữ liệu được truyền từ bên ngoài vào hộp thoại >>>>>${this.nzModalData.title}`);
  }
}
