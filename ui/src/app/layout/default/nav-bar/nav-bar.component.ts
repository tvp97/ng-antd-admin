import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef, booleanAttribute, input, computed, signal, effect, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

import { TabService } from '@core/services/common/tab.service';
import { Menu } from '@core/services/types';
import { AuthDirective } from '@shared/directives/auth.directive';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { UserInfoStoreService } from '@store/common-store/userInfo-store.service';
import { fnStopMouseEvent } from '@utils/tools';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/animation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzMenuModule, NzNoAnimationDirective, NgTemplateOutlet, NzButtonModule, NzIconModule, RouterLink, AuthDirective]
})
export class NavBarComponent implements OnInit {
  readonly isMixinHead = input(false, { transform: booleanAttribute }); // Thanh điều hướng trên ở chế độ mixin
  readonly isMixinLeft = input(false, { transform: booleanAttribute });

  private router = inject(Router);
  private userInfoService = inject(UserInfoStoreService);
  private menuServices = inject(MenuStoreService);
  private splitNavStoreService = inject(SplitNavStoreService);
  private activatedRoute = inject(ActivatedRoute);
  private tabService = inject(TabService);
  private themesService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);

  // Signals for state management
  routerPath = signal(this.router.url);
  menus = signal<Menu[]>([]);
  copyMenus = signal<Menu[]>([]);

  // Computed signals from services
  authCodeArray = computed(() => this.userInfoService.$userInfo().authCode);
  $isNightTheme = computed(() => this.themesService.$isNightTheme());

  // Direct access to service signals (they are already signals, not observables)
  themesOptions = this.themesService.$themesOptions;
  isCollapsed = this.themesService.$isCollapsed;
  isOverMode = this.themesService.$isOverModeTheme;
  // Nguồn menu trái khi chế độ mixin
  leftMenuArray = this.splitNavStoreService.$splitLeftNavArray;

  // Computed signals for derived state
  themesMode = computed(() => this.themesOptions().mode);
  isMixinMode = computed(() => this.themesMode() === 'mixin');

  constructor() {
    this.initMenus();
    this.setupRouterListener();
    this.setupCollapseEffect();
    this.setupThemeEffect();
  }

  private initMenus(): void {
    // 1. Đọc $menuArray() — đây là nguồn kích hoạt duy nhất của effect; chỉ khi $menuArray đổi mới chạy lại.
    // 2. untracked(() => this.clickMenuItem(menusArray))
    //    bên trong clickMenuItem đọc this.routerPath() (cũng là signal).
    //    Nếu không bọc untracked, mỗi lần routerPath đổi cũng kích effect → menu bị reset nhầm.
    //    untracked nghĩa là chỉ lấy giá trị routerPath, không đăng ký phụ thuộc.
    //
    // 3. untracked(() => this.cloneMenuArray(processed))
    //    cloneMenuArray không đọc signal; bọc untracked để ràng buộc phụ thuộc effect rõ ràng.
    effect(() => {
      const menusArray = this.menuServices.$menuArray();
      const processed = untracked(() => this.clickMenuItem(menusArray));
      this.menus.set(processed);
      this.copyMenus.set(untracked(() => this.cloneMenuArray(processed)));
      // Effect chạy bất đồng bộ; lúc setMixModeLeftMenu() trong ngOnInit chạy, menus có thể vẫn rỗng.
      // Khi dữ liệu menu sẵn sàng, chế độ mixin cần set lại menu trái, không thì F5 mất menu trái.
      if (untracked(() => this.isMixinMode())) {
        untracked(() => this.setMixModeLeftMenu());
      }
    });
  }

  private setupRouterListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        filter((event: NavigationEnd) => event.url !== '/default/refresh-empty'),
        tap(() => {
          // @ts-ignore
          const url = this.activatedRoute.snapshot['_routerState'].url;
          this.routerPath.set(url);

          // Khi chuyển theme sang mixin: set nguồn menu trái
          // Cố ý gọi trước menus.set() để đọc trạng thái selected do route trước để lại.
          // Đổi menu cấp 1 trên top: menu trái theo cấp 1 đang chọn, không theo route mới ngay.
          if (this.isMixinMode()) {
            this.setMixModeLeftMenu();
          }

          // Cập nhật trạng thái menu
          // copyMenus lưu trạng thái hiện tại: top ẩn con; khi đổi từ top sang side cần giữ trạng thái đó ở side
          this.menus.set(this.clickMenuItem(this.menus()));
          this.copyMenus.set(this.clickMenuItem(this.copyMenus()));

          // Thu gọn menu và không phải over: đóng menu
          if (this.isCollapsed() && !this.isOverMode()) {
            this.menus.set(this.closeMenuOpen(this.menus()));
          }

          // Chế độ top và không over: đóng menu (tránh lỗi popup menu khi đổi tab)
          if (this.themesMode() === 'top' && !this.isOverMode()) {
            this.closeAllMenuOpen();
          }
        }),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(routeData => {
        const isNewTabDetailPage = routeData['newTab'] === 'true';
        this.routeEndAction(isNewTabDetailPage);
      });
  }

  /** Theo dõi thu gọn/mở rộng menu */
  private setupCollapseEffect(): void {
    effect(() => {
      const collapsed = this.isCollapsed();

      if (!collapsed) {
        // Mở rộng menu
        const updated = untracked(() => this.clickMenuItem(this.cloneMenuArray(this.copyMenus())));
        this.menus.set(updated);

        // Mixin: cần áp clickMenuItem cho nguồn menu trái, nếu không menu 2 cấp không mở đúng khi bung từ thu gọn
        if (untracked(() => this.themesMode()) === 'mixin') {
          const leftUpdated = untracked(() => this.clickMenuItem(this.leftMenuArray()));
          this.splitNavStoreService.$splitLeftNavArray.set(leftUpdated);
        }
      } else {
        // Thu gọn: lưu trạng thái mở vào copyMenus để bung lại đúng.
        // Không gọi menus.set(); hiệu ứng thu do nzInlineCollapsed;
        // closeMenuOpen chỉ đồng bộ open trong bộ nhớ, tránh lệch khi bung.
        const copy = untracked(() => this.cloneMenuArray(this.menus()));
        this.copyMenus.set(this.closeMenuOpen(copy));
      }
    });
  }

  // Effect to handle theme mode changes
  private setupThemeEffect(): void {
    effect(() => {
      const mode = this.themesMode();
      const overMode = untracked(() => this.isOverMode());

      if (mode === 'top' && !overMode) {
        untracked(() => this.closeMenu());
      }
    });
  }

  /** Set nguồn menu trái (split nav) khi mixin */
  setMixModeLeftMenu(): void {
    const menus = this.menus();
    menus.forEach(item => {
      if (item.selected) {
        this.splitNavStoreService.$splitLeftNavArray.set(item.children || []);
      }
    });
  }

  /** Clone sâu mảng menu */
  cloneMenuArray(sourceMenuArray: Menu[], target: Menu[] = []): Menu[] {
    sourceMenuArray.forEach(item => {
      const obj: Menu = { menuName: '', menuType: 'C', path: '', id: -1, fatherId: -1, code: '' };
      for (const i in item) {
        if (item.hasOwnProperty(i)) {
          // @ts-ignore
          if (Array.isArray(item[i])) {
            // @ts-ignore
            obj[i] = this.cloneMenuArray(item[i]);
          } else {
            // @ts-ignore
            obj[i] = item[i];
          }
        }
      }
      target.push({ ...obj });
    });
    return target;
  }

  /** Mixin: nhấn menu cấp 1 — chọn mục con đầu tiên hợp lệ */
  changTopNav(index: number): void {
    const currentTopNav = this.menus()[index];
    let currentLeftNavArray = currentTopNav.children || [];
    if (currentLeftNavArray.length > 0) {
      /* Lọc theo quyền */
      // Các mục cấp 2 có quyền (hiển thị bên trái)
      currentLeftNavArray = currentLeftNavArray.filter(item => {
        return this.authCodeArray().includes(item.code!);
      });
      if (currentLeftNavArray.length > 0 && !currentLeftNavArray[0].children) {
        this.router.navigateByUrl(currentLeftNavArray[0].path!);
      } else if (currentLeftNavArray.length > 0 && currentLeftNavArray[0].children) {
        // Có cấp 3: điều hướng tới mục cấp 3 đầu tiên
        this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      }
    }
    this.splitNavStoreService.$splitLeftNavArray.set(currentLeftNavArray);
  }

  // flatMenu phải thuần hàm (trả mảng mới), không mutate menus gốc.
  // Gọi trong effect (qua clickMenuItem): sửa object trong signal trực tiếp sẽ kích effect lặp vô hạn.
  flatMenu(menus: Menu[], routePath: string): Menu[] {
    return menus.map(item => {
      const isActive = routePath.includes(item.path) && !item.newLinkFlag;
      const hasChildren = item.children && item.children.length > 0;

      return {
        ...item,
        selected: isActive,
        open: isActive,
        children: hasChildren ? this.flatMenu(item.children!, routePath) : item.children
      };
    });
  }

  clickMenuItem(menus: Menu[]): Menu[] {
    if (!menus) {
      return menus;
    }
    const routerPath = this.routerPath();
    const index = routerPath.indexOf('?') === -1 ? routerPath.length : routerPath.indexOf('?');
    const routePath = routerPath.substring(0, index);
    return this.flatMenu(menus, routePath);
  }

  /** Đặt mục menu hiện tại là mở, các mục khác đóng */
  changeOpen(currentMenu: Menu, allMenu: Menu[]): void {
    allMenu.forEach(item => {
      item.open = false;
    });
    currentMenu.open = true;
  }

  // Giống flatMenu: thuần hàm, không mutate.
  closeMenuOpen(menus: Menu[]): Menu[] {
    return menus.map(menu => ({
      ...menu,
      open: false,
      children: menu.children && menu.children.length > 0
        ? this.closeMenuOpen(menu.children)
        : menu.children
    }));
  }

  changeRoute(e: MouseEvent, menu: Menu): void {
    if (menu.newLinkFlag) {
      fnStopMouseEvent(e);
      window.open(menu.path, '_blank');
      return;
    }
    this.router.navigate([menu.path]);
  }

  /** Chỉ đóng mọi mục mở, không đổi selected */
  private closeAllMenuOpen(): void {
    this.menus.set(this.closeMenuOpen(this.menus()));
  }

  closeMenu(): void {
    // clickMenuItem cập nhật selected, closeMenuOpen đóng mở
    const menusWithSelection = this.clickMenuItem(this.menus());
    this.menus.set(this.closeMenuOpen(menusWithSelection));
    this.copyMenus.set(this.clickMenuItem(this.copyMenus()));
  }

  routeEndAction(isNewTabDetailPage = false): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    let title = 'Ant Design';
    if (typeof route.routeConfig?.title === 'string') {
      title = route.routeConfig?.title;
    }

    this.tabService.addTab(
      {
        snapshotArray: [route.snapshot],
        title,
        path: this.routerPath()
      },
      isNewTabDetailPage
    );
    this.tabService.findIndex(this.routerPath());
    // Mixin: đổi tab thì đồng bộ menu trái
    this.setMixModeLeftMenu();
  }

  ngOnInit(): void {
    this.routeEndAction();
  }
}
