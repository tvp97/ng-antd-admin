import { computed, Injectable, signal } from '@angular/core';

import { Theme, ThemeMode } from '@app/layout/default/setting-drawer/setting-drawer.component';

export interface SettingInterface {
  theme: Theme['key']; // Chế độ giao diện (chế độ tối, chế độ sáng)
  color: string; // Màu chủ đạo
  mode: ThemeMode['key']; // Chế độ menu (chế độ bên, chế độ trên cùng, chế độ hỗn hợp)
  colorWeak: boolean; // thiếu sắc tố
  greyTheme: boolean; // Chế độ xám
  fixedHead: boolean; // Đầu cố định
  splitNav: boolean; // Có tách menu không (chỉ có hiệu lực khi chế độ menu là chế độ hỗn hợp)
  fixedLeftNav: boolean; // Cố định menu bên trái
  isShowTab: boolean; // Có hiển thị nhiều tab không
  fixedTab: boolean; // Cố địnhtabTrang tab
  hasTopArea: boolean; // Có hiển thị khu vực trên cùng không
  hasFooterArea: boolean; // Có hiển thị khu vực dưới cùng không
  hasNavArea: boolean; // Có thực đơn không?
  hasNavHeadArea: boolean; // Menu có tiêu đề menu không
}

export type StyleTheme = 'default' | 'dark' | 'aliyun' | 'compact'; // Chủ đề mặc định, Chủ đề tối, Chủ đề Alibaba Cloud, Chủ đề gọn gàng

// Phong cách chủ đề
export type StyleThemeInterface = Record<StyleTheme, boolean>;

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  $themeStyle = signal<StyleTheme>('default'); // Chủ đề phong cách, tối, mặc định, gọn gàng, Alibaba Cloud
  $isNightTheme = computed(() => this.$themeStyle() === 'dark'); // Chủ đề tối
  $isCompactTheme = computed(() => this.$themeStyle() === 'compact'); // Chủ đề gọn gàng
  $isOverModeTheme = signal(false); // overChế độ, tức là kéo độ rộng của trình duyệt cho đến khi thanh menu biến mất
  $isCollapsed = signal(false); // Chế độ thu gọn menu, kéo trình duyệt để menu tự động thu thành biểu tượng
  $themesOptions = signal<SettingInterface>({
    theme: 'dark',
    color: '#1890FF',
    mode: 'side',
    isShowTab: true,
    colorWeak: false,
    greyTheme: false,
    splitNav: false,
    fixedTab: true,
    fixedHead: true,
    fixedLeftNav: true,
    hasTopArea: true,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true
  });
}
