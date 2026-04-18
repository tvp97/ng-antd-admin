import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SettingDrawerComponent, Theme } from '@app/layout/default/setting-drawer/setting-drawer.component';
import { CollapsedNavWidth, IsFirstLogin, SideNavWidth } from '@config/constant';
import { DriverService } from '@core/services/common/driver.service';
import { WindowService } from '@core/services/common/window.service';
import { LayoutHeadRightMenuComponent } from '@shared/biz-components/layout-components/layout-head-right-menu/layout-head-right-menu.component';
import { ChatComponent } from '@shared/components/chat/chat.component';
import { TopProgressBarComponent } from '@shared/components/top-progress-bar/top-progress-bar.component';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/animation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavDrawerComponent } from './nav-drawer/nav-drawer.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TabComponent } from './tab/tab.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrl: './default.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TopProgressBarComponent,
    NzLayoutModule,
    NzNoAnimationDirective,
    SettingDrawerComponent,
    ChatComponent,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    SideNavComponent,
    NgTemplateOutlet,
    ToolBarComponent,
    NzIconModule,
    NzButtonModule,
    NavBarComponent,
    LayoutHeadRightMenuComponent,
    TabComponent,
    RouterOutlet,
    NavDrawerComponent,
    ChatComponent
]
})
export class DefaultComponent implements AfterViewInit {
  readonly navDrawer = viewChild.required<NavDrawerComponent>('navDrawer');
  SideNavWidth = SideNavWidth;
  CollapsedNavWidth = CollapsedNavWidth;

  destroyRef = inject(DestroyRef); // Dùng để hủy đăng ký
  windowService = inject(WindowService); // Dùng để lấywindowĐối tượng
  driverService = inject(DriverService); // Dùng để hướng dẫn người dùng
  themesService = inject(ThemeService); // Dùng để lấy chủ đề
  splitNavStoreService = inject(SplitNavStoreService); // Dùng để lấy menu phân táchstore
  $themesOptionsEffect = effect(() => {
    const { fixedTab, fixedHead, hasFooterArea, mode, fixedLeftNav, hasNavArea, hasTopArea, hasNavHeadArea, isShowTab, splitNav, theme } = this.themesService.$themesOptions();

    this.isMixinMode = mode === 'mixin';
    this.isSideMode = mode === 'side';
    this.isTopMode = mode === 'top';
    this.isFixedLeftNav = fixedLeftNav;
    this.isHasNavArea = hasNavArea;
    this.isHasTopArea = hasTopArea;
    this.isHasNavHeadArea = hasNavHeadArea;
    this.isShowTab = isShowTab;
    this.isSplitNav = splitNav;
    this.theme = theme;
    this.isFixedHead = fixedHead;
    this.isHasFooterArea = hasFooterArea;
    this.isFixedTab = fixedTab;

    this.contentMarginTop = this.judgeMarginTop();
  });
  $themeStyleEffect = effect(() => {
    // Trích dẫnsingleđể kích hoạteffect
    const source = this.themesService.$themeStyle();
    // Khi chuyển đổi chế độ phong cách cũng cần tính toán lạimargin，cái này vớithemesOptions$Ở đây dường như là mã bị lặp lại, cân nhắc sử dụngcombineLatestNếu tiến hành hợp nhất, sẽ có mất mát hiệu suất (cũng sẽ thực hiện khi chuyển đổi phong cách)themeOptionsLogic bên trong), nên ở đây viết tách ra
    this.contentMarginTop = this.judgeMarginTop();
  });

  showChats = true; // Có hiển thị cửa sổ trò chuyện không
  isMixinMode = false; // Có phải là chế độ hỗn hợp không
  isNightTheme = computed(() => this.themesService.$isNightTheme()); // Có phải là chủ đề tối không
  isCompactTheme = computed(() => this.themesService.$isCompactTheme()); // Có phải là chủ đề gọn nhẹ không
  isCollapsed = computed(() => this.themesService.$isCollapsed()); // Có gập menu bên trái không
  isFixedLeftNav = false; // Có cố định menu bên trái không
  isSplitNav = false; // Có chia menu không
  isOverMode = computed(() => this.themesService.$isOverModeTheme()); // Khi cửa sổ thu hẹp, thanh điều hướng có chuyển sang chế độ ngăn kéo không
  isShowTab = false; // Có hiển thị tab không
  isFixedTab = false; // Có cố định tab không
  isHasNavArea = false; // Có khu vực menu không
  isHasNavHeadArea = false; // Có phần đầu menu không
  isHasFooterArea = false; // Có khu vực phía dưới không
  isHasTopArea = false; // Có khu vực ở phía trên không

  isFixedHead = false; // Có cố định phần đầu không
  isSideMode = false; // Có phải là chế độ cạnh bên không
  isTopMode = false; // Có phải là mô hình đỉnh không
  theme: Theme['key'] = 'dark'; // Chế độ chủ đề

  // Menu bên trái ở chế độ hỗn hợp
  mixinModeLeftNav = computed(() => {
    return this.splitNavStoreService.$splitLeftNavArray();
  });
  contentMarginTop = '48px';

  changeCollapsed(isCollapsed: boolean): void {
    // Nếu làoverChế độ, nhấn vào menu bên trái, hiển thị menu ngăn kéo
    if (this.isOverMode()) {
      this.navDrawer().showDraw();
      return;
    }
    // Thiết lập trạng thái có gập menu bên trái hay không
    this.themesService.$isCollapsed.set(isCollapsed);
  }

  judgeMarginTop(): string {
    let marginTop;
    if (this.isFixedHead && !this.isMixinMode && this.isHasTopArea) {
      marginTop = this.isShowTab ? (this.isFixedTab ? 96 : 48) : 48;
    } else {
      marginTop = this.isShowTab ? (this.isFixedTab ? 48 : 0) : 0;
    }
    if (this.isCompactTheme()) {
      marginTop = marginTop - 8;
    }
    return `${marginTop}px`;
  }

  ngAfterViewInit(): void {
    if (this.windowService.getStorage(IsFirstLogin) === 'false') {
      return;
    }
    this.windowService.setStorage(IsFirstLogin, 'false');
    this.driverService.load();
  }
}
