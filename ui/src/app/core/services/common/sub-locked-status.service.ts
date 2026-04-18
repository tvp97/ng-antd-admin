import { DestroyRef, inject, Injectable } from '@angular/core';

import { LockedKey, salt } from '@config/constant';
import { WindowService } from '@core/services/common/window.service';
import { LockScreenStoreService } from '@store/common-store/lock-screen-store.service';
import { fnDecrypt, fnEncrypt } from '@utils/tools';

// Lắng nghe trạng thái khóa màn hình
@Injectable({
  providedIn: 'root'
})
export class SubLockedStatusService {
  private windowSer = inject(WindowService);
  private lockScreenStoreService = inject(LockScreenStoreService);
  destroyRef = inject(DestroyRef);

  initLockedStatus(): void {
    // Xác định có bộ nhớ đệm hay không
    const hasCash = this.windowSer.getSessionStorage(LockedKey);
    if (hasCash) {
      this.lockScreenStoreService.lockScreenSignalStore.set(fnDecrypt(hasCash, salt));
    } else {
      const lockScreenInfo = this.lockScreenStoreService.lockScreenSignalStore();
      this.windowSer.setSessionStorage(LockedKey, fnEncrypt(JSON.stringify(lockScreenInfo), salt));
    }
  }
}
