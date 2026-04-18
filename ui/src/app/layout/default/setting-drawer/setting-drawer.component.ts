import { CdkDrag } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, Renderer2, signal, DOCUMENT } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { StyleThemeModelKey, ThemeOptionsKey } from '@config/constant';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { TabService } from '@core/services/common/tab.service';
import { ThemeSkinService } from '@core/services/common/theme-skin.service';
import { WindowService } from '@core/services/common/window.service';
import { SettingInterface, StyleTheme, StyleThemeInterface, ThemeService } from '@store/common-store/theme.service';
import { fnFormatToHump } from '@utils/tools';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

interface NormalModel {
  image?: string;
  title: string;
  isChecked: boolean;
}

export interface Theme extends NormalModel {
  key: 'dark' | 'light';
}

type SpecialTheme = 'color-weak' | 'grey-theme';
type SpecialThemeHump = 'colorWeak' | 'greyTheme';

interface Color extends NormalModel {
  key: string;
  color: string;
}

export interface ThemeMode extends NormalModel {
  key: 'side' | 'top' | 'mixin';
}

type ExcludedKeys = 'theme' | 'color' | 'mode';
type SettingKey = Exclude<keyof SettingInterface, ExcludedKeys>;

@Component({
  selector: 'app-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  styleUrl: './setting-drawer.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDrag, NzIconModule, NzButtonModule, NzDrawerModule, NzTooltipModule, NzDividerModule, NzListModule, NzSwitchModule, FormsModule]
})
export class SettingDrawerComponent implements OnInit {
  private themesService = inject(ThemeService);
  private tabService = inject(TabService);
  private activatedRoute = inject(ActivatedRoute);
  private doc = inject(DOCUMENT);
  private nzConfigService = inject(NzConfigService);
  private themeSkinService = inject(ThemeSkinService);
  private windowServe = inject(WindowService);
  private rd2 = inject(Renderer2);
  destroyRef = inject(DestroyRef);

  $themesOptions = computed(() => {
    return this.themesService.$themesOptions();
  });
  $currentStyleTheme = signal<StyleThemeInterface>({
    default: false,
    dark: false,
    compact: false,
    aliyun: false
  });
  themeStyleEffect = effect(() => {
    const source = this.themesService.$themeStyle();
    this.$currentStyleTheme.set({
      ...{
        default: false,
        dark: false,
        compact: false,
        aliyun: false
      },
      [source]: true
    });
  });

  isCollapsed = false;
  dragging = false;

  themes: Theme[] = [
    {
      key: 'dark',
      image: 'imgs/theme-dark.svg',
      title: 'Menu tối',
      isChecked: true
    },
    {
      key: 'light',
      image: 'imgs/theme-light.svg',
      title: 'Menu sáng',
      isChecked: false
    }
  ];
  colors: Color[] = [
    {
      key: 'dust',
      color: '#F5222D',
      title: 'Đỏ Dust',
      isChecked: false
    },
    {
      key: 'volcano',
      color: '#FA541C',
      title: 'Núi lửa',
      isChecked: false
    },
    {
      key: 'sunset',
      color: '#FAAD14',
      title: 'Hoàng hôn',
      isChecked: false
    },
    {
      key: 'cyan',
      color: '#13C2C2',
      title: 'Xanh cyan',
      isChecked: false
    },
    {
      key: 'green',
      color: '#52C41A',
      title: 'Xanh lá',
      isChecked: false
    },
    {
      key: 'daybreak',
      color: '#1890FF',
      title: 'Xanh bình minh (mặc định)',
      isChecked: true
    },
    {
      key: 'geekblue',
      color: '#2F54EB',
      title: 'Xanh geek',
      isChecked: false
    },
    {
      key: 'purple',
      color: '#722ED1',
      title: 'Tím',
      isChecked: false
    }
  ];
  modes: ThemeMode[] = [
    {
      key: 'side',
      image: 'imgs/menu-side.svg',
      title: 'Menu bên trái',
      isChecked: true
    },
    {
      key: 'top',
      image: 'imgs/menu-top.svg',
      title: 'Menu trên cùng',
      isChecked: false
    },
    {
      key: 'mixin',
      image: 'imgs/menu-top.svg',
      title: 'Menu kết hợp',
      isChecked: false
    }
  ];

  changeCollapsed(): void {
    if (!this.dragging) {
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.dragging = false;
    }
  }

  changePrimaryColor(color: Color): void {
    this.selOne(color as NormalModel, this.colors);
    this.nzConfigService.set('theme', { primaryColor: color.color });
    this.themesService.$themesOptions.update(v => {
      return { ...v, color: color.color };
    });
    this.setThemeOptions();
  }

  // Chỉnh sửa chủ đề
  changeStyleTheme(styleTheme: StyleTheme): void {
    // Đặt mỗi chủ đề thành không được chọn,Chủ đề đang chọn hiện tại chuyển sang trạng thái được chọn
    this.$currentStyleTheme.set({
      ...{
        default: false,
        dark: false,
        compact: false,
        aliyun: false
      },
      [styleTheme]: true
    });

    // Lưu trạng thái chế độ chủ đề
    this.themesService.$themeStyle.set(styleTheme);
    // khả năng lưu trữ lâu dài
    this.windowServe.setStorage(StyleThemeModelKey, styleTheme);
    // Chuyển đổi chủ đề
    this.themeSkinService.toggleTheme().then();
  }

  // Chọn một cáiisCheckedvìtrue,khácfalse
  selOne(item: NormalModel, itemArray: NormalModel[]): void {
    itemArray.forEach(_item => (_item.isChecked = false));
    item.isChecked = true;
  }

  changeMode(mode: ThemeMode): void {
    this.selOne(mode, this.modes);
    this.themesService.$isCollapsed.set(false);

    this.themesService.$themesOptions.update(v => {
      return { ...v, mode: mode.key };
    });

    this.setThemeOptions();
  }

  // Chuyển đổi chủ đề
  changeTheme(themeItem: Theme): void {
    this.selOne(themeItem, this.themes);
    this.themesService.$themesOptions.update(v => {
      return { ...v, theme: themeItem.key };
    });
    this.setThemeOptions();
  }

  // Thiết lập tham số chủ đề
  setThemeOptions(): void {
    this.windowServe.setStorage(ThemeOptionsKey, JSON.stringify(this.$themesOptions()));
  }

  // Chỉnh sửa mục cấu hình chủ đề
  changeThemeOptions(isTrue: boolean, type: SettingKey): void {
    // Khi đầu không cố định, việc cài nhãn cũng không cố định
    if (type === 'fixedHead' && !isTrue) {
      this.themesService.$themesOptions.update(v => {
        return { ...v, fixedTab: false };
      });
    }
    this.themesService.$themesOptions.update(v => {
      return { ...v, [type]: isTrue };
    });
    this.setThemeOptions();

    // Nếu không hiển thị nhiều thẻ, thì cần xóa sạchtab,và tất cả các thành phần đã được lưu trong bộ nhớ đệm
    if (type === 'isShowTab') {
      if (!isTrue) {
        SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot).then(() => {
          this.tabService.clearTabs();
        });
      } else {
        this.tabService.refresh();
      }
    }
  }

  // Chỉnh sửa chủ đề đặc biệt, chủ đề cho người mù màu, chủ đề màu xám
  changeSpecialTheme(e: boolean, themeType: SpecialTheme): void {
    const name = this.doc.getElementsByTagName('html');
    const theme = fnFormatToHump(themeType);
    if (e) {
      this.rd2.addClass(name[0], themeType);
    } else {
      this.rd2.removeClass(name[0], themeType);
    }
    this.themesService.$themesOptions.update(v => {
      return { ...v, [theme as SpecialThemeHump]: e };
    });
    this.setThemeOptions();
  }

  initThemeOption(): void {
    // Chuyển đổi chủ đề chế độ đặc biệt (chế độ mù màu, chế độ xám)
    (['grey-theme', 'color-weak'] as SpecialTheme[]).forEach(item => {
      const specialTheme = fnFormatToHump(item);
      this.changeSpecialTheme(this.$themesOptions()[specialTheme as SpecialThemeHump], item);
    });

    this.modes.forEach(item => {
      item.isChecked = item.key === this.$themesOptions().mode;
    });
    this.colors.forEach(item => {
      item.isChecked = item.color === this.$themesOptions().color;
    });
    this.changePrimaryColor(this.colors.find(item => item.isChecked)!);
    this.themes.forEach(item => {
      item.isChecked = item.key === this.$themesOptions().theme;
    });
  }

  ngOnInit(): void {
    this.initThemeOption();
  }

  dragEnd(): void {
    if (this.dragging) {
      setTimeout(() => {
        this.dragging = false;
      });
    }
  }
}
