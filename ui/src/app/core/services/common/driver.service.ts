import { computed, DestroyRef, inject, Injectable, DOCUMENT } from '@angular/core';

import { ThemeService } from '@store/common-store/theme.service';
import { driver, DriveStep } from 'driver.js';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
/*
 * https://madewith.cn/766
 * Trang dẫn hướng
 * */
@Injectable({
  providedIn: 'root'
})
export class DriverService {
  themesService = inject(ThemeService);
  destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);
  $fixedTab = computed(() => this.themesService.$themesOptions().fixedTab);

  load(): void {
    // Có phải là tab cố định không
    const tabId = !this.$fixedTab() ? '#multi-tab' : '#multi-tab2';
    const steps: DriveStep[] = [
      {
        element: '#menuNav',
        popover: {
          title: 'Thực đơn',
          description: 'Đây là thực đơn',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '#drawer-handle',
        popover: {
          title: 'Nút cài đặt chủ đề',
          description: 'Nhấn để mở rộng cài đặt chủ đề, có thể kéo lên và xuống',
          side: 'left'
        }
      },
      {
        element: '#tools',
        popover: {
          title: 'Thanh công cụ',
          description: 'Khóa màn hình,Tìm kiếmMenu, toàn màn hình, thông báo, đăng xuất, đa ngôn ngữ',
          side: 'bottom'
        }
      },
      {
        element: '#chats',
        popover: {
          title: 'Liên hệ quản trị viên',
          description: 'Liên hệ với quản trị viên',
          side: 'top'
        }
      },
      {
        element: '#trigger',
        popover: {
          title: 'Menu gập',
          description: 'Thu gọn menu',
          side: 'bottom'
        }
      },
      {
        element: tabId,
        popover: {
          title: 'Đa nhãn',
          description: 'Nhấp chuột phải vào một tab đơn có thể mở ra nhiều tùy chọn, khi vượt quá màn hình, cuộn bánh xe chuột có thể di chuyển các tab.',
          side: 'bottom'
        }
      }
    ];

    // https://github.com/kamranahmedse/driver.js/issues/489
    const filteredSteps: NzSafeAny = steps.filter(step => {
      const element = document.querySelector(step.element as string);
      return !step.element || element !== null;
    });

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: 'Hoàn thành',
      nextBtnText: 'Bước tiếp theo',
      prevBtnText: 'Bước trước',
      onHighlightStarted: () => {
        this.doc.body.style.cssText = 'overflow:hidden';
      },
      onDestroyed: () => {
        this.doc.body.style.cssText = '';
      },
      steps: filteredSteps
    });

    driverObj.drive();
  }
}
