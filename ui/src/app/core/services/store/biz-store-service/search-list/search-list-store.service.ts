import { Injectable, signal } from '@angular/core';

type componentName = 'Tìm kiếm列表（文章）' | 'Tìm kiếm列表（项目）' | 'Tìm kiếm列表（应用）';

/**
 * 这个是缓存Tìm kiếm列表的store，属于业务的store
 */
@Injectable({
  providedIn: 'root'
})
export class SearchListStoreService {
  $searchListComponentStore = signal<componentName>('Tìm kiếm列表（文章）');
}
