import { Component, ChangeDetectionStrategy, inject, DestroyRef, computed } from '@angular/core';

import { LockScreenStoreService } from '@store/common-store/lock-screen-store.service';

/*Bộ phận này nhằm để giải quyết khi khóa màn hìnhf12Vẫn có thể xem được các trang bị ẩn, cũng như các trang trống đã tạo*/
@Component({
  selector: 'app-empty-for-lock',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyForLockComponent {
  destroyRef = inject(DestroyRef);
  private lockScreenStoreService = inject(LockScreenStoreService);
  // Trạng thái khóa màn hình của bộ định tuyến
  routeStatus = computed(() => {
    return this.lockScreenStoreService.lockScreenSignalStore();
  });
}
