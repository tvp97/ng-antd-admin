import { Injectable, signal } from '@angular/core';

type componentName = 'Tìm kiếmDanh sách (bài viết)' | 'Tìm kiếmDanh sách (mục)' | 'Tìm kiếmDanh sách (ứng dụng)';

/**
 * Đây là bộ nhớ đệmTìm kiếmdạng danh sáchstorethuộc về kinh doanhstore
 */
@Injectable({
  providedIn: 'root'
})
export class SearchListStoreService {
  $searchListComponentStore = signal<componentName>('Tìm kiếmDanh sách (bài viết)');
}
