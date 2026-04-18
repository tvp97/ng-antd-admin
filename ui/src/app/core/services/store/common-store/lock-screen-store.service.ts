import { Injectable, signal } from '@angular/core';

export interface LockScreenFlag {
  locked: boolean;
  password: string;
  beforeLockPath: string;
}

/**
 * Trạng thái khóa màn hìnhservicecủastore
 */
@Injectable({
  providedIn: 'root'
})
export class LockScreenStoreService {
  lockScreenSignalStore = signal<LockScreenFlag>({ locked: false, password: '', beforeLockPath: '' });
}
