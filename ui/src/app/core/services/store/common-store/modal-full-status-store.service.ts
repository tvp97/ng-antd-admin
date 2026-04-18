import { Injectable, signal } from '@angular/core';

/**
 * Dùng để lưu trữ trạng thái hộp thoại có phải là toàn màn hình hay khôngservice
 * Ngay cả khi mở nhiều hộp thoại, cùng một lúc cũng chỉ có thể tồn tại một hộp thoại toàn màn hình
 *
 */
@Injectable({
  providedIn: 'root'
})
export class ModalFullStatusStoreService {
  $modalFullStatusStore = signal(false);
}
