import { Injectable, signal } from '@angular/core';

import { Menu } from '../../types';

/**
 * Khi tự động phân tách menu, menu bên trái củastore
 */
@Injectable({
  providedIn: 'root'
})
export class SplitNavStoreService {
  $splitLeftNavArray = signal<Menu[]>([]);
}
