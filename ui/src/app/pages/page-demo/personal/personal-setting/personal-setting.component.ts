import { BreakpointObserver } from '@angular/cdk/layout';

import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef, viewChild, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AdComponent, DynamicComponent } from '@core/services/types';
import { AdDirective } from '@shared/directives/ad.directive';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModeType, NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { BaseComponent } from './base/base.component';
import { BindComponent } from './bind/bind.component';
import { NoticeComponent } from './notice/notice.component';
import { SafeComponent } from './safe/safe.component';
import { AdDirective as AdDirective_1 } from '../../../../shared/directives/ad.directive';

interface TabInterface {
  key: string;
  component: DynamicComponent;
}

@Component({
  selector: 'app-personal-setting',
  templateUrl: './personal-setting.component.html',
  styleUrl: './personal-setting.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzCardModule, NzMenuModule, NzButtonModule, NzGridModule, NzTypographyModule, AdDirective_1]
})
export class PersonalSettingComponent implements OnInit {
  readonly adHost = viewChild.required(AdDirective);
  tabModel = signal<NzMenuModeType>('inline');
  settingComponent: TabInterface[] = [
    {
      key: 'base',
      component: new DynamicComponent(BaseComponent, { label: 'Cài đặt cơ bản' })
    },
    {
      key: 'safe',
      component: new DynamicComponent(SafeComponent, { label: 'Cài đặt bảo mật' })
    },
    {
      key: 'bind',
      component: new DynamicComponent(BindComponent, { label: 'Liên kết tài khoản' })
    },
    {
      key: 'notice',
      component: new DynamicComponent(NoticeComponent, { label: 'Thông báo tin mới' })
    }
  ];
  destroyRef = inject(DestroyRef);
  menus: Array<{ key: string; title: string; selected?: boolean }> = [
    {
      key: 'base',
      title: 'Cài đặt cơ bản',
      selected: true
    },
    {
      key: 'safe',
      title: 'Cài đặt bảo mật',
      selected: false
    },
    {
      selected: false,
      key: 'bind',
      title: 'Liên kết tài khoản'
    },
    {
      selected: false,
      key: 'notice',
      title: 'Thông báo tin mới'
    }
  ];
  currentTitle: string = this.menus[0].title;

  private breakpointObserver = inject(BreakpointObserver);

  to(item: { key: string; title: string; selected?: boolean }): void {
    const selMenu = this.settingComponent.find(({ key }) => {
      return key === item.key;
    });
    this.currentTitle = selMenu!.component.data.label;
    const viewContainerRef = this.adHost().viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<AdComponent>(selMenu!.component.component);
    componentRef.instance.data = selMenu!.component.data;
  }

  obBreakPoint(): void {
    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.tabModel.set(result.matches ? 'horizontal' : 'inline');
      });
  }

  ngOnInit(): void {
    this.to(this.menus[0]);
    this.obBreakPoint();
  }
}
