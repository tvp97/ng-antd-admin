import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';

import { TabModel, TabService } from '@core/services/common/tab.service';
import { MouseHoverShowDirective } from '@shared/directives/mouse-hover-show.directive';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { fnStopMouseEvent } from '@utils/tools';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzContextMenuService, NzDropdownMenuComponent, NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzCardModule, NzTabsModule, NzDropdownModule, NzMenuModule, NzButtonModule, MouseHoverShowDirective, NzIconModule]
})
export class TabComponent {
  private tabService = inject(TabService);
  private nzContextMenuService = inject(NzContextMenuService);
  private splitNavStoreService = inject(SplitNavStoreService);
  private themesService = inject(ThemeService);
  router = inject(Router);

  tabsSourceData = this.tabService.$tabArray;
  currentIndex = computed(() => this.tabService.$currSelectedIndexTab());
  $themesOptions = computed(() => this.themesService.$themesOptions());
  $leftMenuArray = computed(() => this.splitNavStoreService.$splitLeftNavArray());
  $isOverMode = computed(() => this.themesService.$isOverModeTheme());
  $isCollapsed = computed(() => this.themesService.$isCollapsed());

  public trackByTab(index: number, tab: TabModel): string {
    return tab.title;
  }

  /** Nhấn thẻ → điều hướng tới path */
  goPage(tab: TabModel): void {
    this.router.navigateByUrl(tab.path);
  }

  /** Chuột phải: đóng các thẻ bên phải */
  closeRithTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e);
    this.tabService.delRightTab(tab.path, index);
  }

  /** Chuột phải: đóng các thẻ bên trái */
  closeLeftTab(tab: TabModel, e: MouseEvent, index: number): void {
    if (index === 0) {
      return;
    }
    fnStopMouseEvent(e);
    this.tabService.delLeftTab(tab.path, index);
  }

  /** Đóng các thẻ khác (giữ thẻ hiện tại) */
  closeOtherTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e);
    this.tabService.delOtherTab(tab.path, index);
  }

  /** Chuột phải: đóng thẻ hiện tại */
  closeTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e);
    this.closeCurrentTab(tab, index);
  }

  // Nhấn icon đóng trên thẻ
  clickCloseIcon(indexObj: { index: number }): void {
    this.closeCurrentTab(this.tabsSourceData()[indexObj.index], indexObj.index);
  }

  closeCurrentTab(tab: TabModel, index: number): void {
    if (this.tabsSourceData().length === 1) {
      return;
    }
    this.tabService.delTab(tab, index);
  }

  refresh(): void {
    this.tabService.refresh();
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
}

