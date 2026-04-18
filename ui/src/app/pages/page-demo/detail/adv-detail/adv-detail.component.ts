import { BreakpointObserver } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, AfterViewInit, ChangeDetectorRef, inject, DestroyRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

interface ReturnObj {
  num: string;
  name: string;
  code: string;
  unitPrice: number;
  number: string;
  price: string;
}

enum TabEnum {
  Detail,
  Rule
}

@Component({
  selector: 'app-adv-detail',
  templateUrl: './adv-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzRadioModule,
    NzDropdownModule,
    NzIconModule,
    NzButtonModule,
    NzMenuModule,
    NzWaveModule,
    NzGridModule,
    NzDescriptionsModule,
    NzStatisticModule,
    NzTabsModule,
    NzCardModule,

    NzStepsModule,
    NzPopoverModule,
    NgTemplateOutlet,
    NzBadgeModule,
    NzTooltipModule,
    NzDividerModule,
    NzEmptyModule,
    AntTableComponent
  ]
})
export class AdvDetailComponent implements OnInit, AfterViewInit {
  readonly headerExtra = viewChild.required<TemplateRef<NzSafeAny>>('headerExtra');
  readonly headerContent = viewChild.required<TemplateRef<NzSafeAny>>('headerContent');
  readonly headerFooter = viewChild.required<TemplateRef<NzSafeAny>>('headerFooter');
  readonly highLightTpl = viewChild.required<TemplateRef<NzSafeAny>>('highLightTpl');
  stepDirection: 'horizontal' | 'vertical' = 'horizontal';
  returnTableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  tabEnum = TabEnum;
  currentSelTab: number = this.tabEnum.Detail;
  destroyRef = inject(DestroyRef);

  returnDataList: ReturnObj[] = [
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: 'Trình diễn phạm vi',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: 'Trình diễn phạm vi',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: 'Trình diễn phạm vi',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: 'Trình diễn phạm vi',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: 'Trình diễn phạm vi',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    }
  ];
  private cdr = inject(ChangeDetectorRef);
  private breakpointObserver = inject(BreakpointObserver);

  to(tabIndex: TabEnum): void {
    this.currentSelTab = tabIndex;
    this.cdr.detectChanges();
  }

  private initReturnTable(): void {
    this.returnTableConfig = {
      showCheckbox: false,
      headers: [
        {
          title: 'Loại thao tác',
          field: 'num',
          width: 50
        },
        {
          title: 'Người vận hành',
          width: 60,
          field: 'name'
        },
        {
          title: 'Kết quả thực hiện',
          width: 50,
          field: 'code',
          tdTemplate: this.highLightTpl()
        },
        {
          title: 'Thời gian thao tác',
          width: 50,
          field: 'unitPrice',
          pipe: 'date:yyyy-MM-dd HH:mm'
        },
        {
          title: 'Ghi chú',
          width: 50,
          field: 'number'
        }
      ],
      xScroll: 500,
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 770px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.matches) {
          this.stepDirection = 'vertical';
        } else {
          this.stepDirection = 'horizontal';
        }
      });
    this.initReturnTable();
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Số đơn:234231029431',
      breadcrumb: ['Trang chủ', 'Chi tiếttrang', 'Cao cấpChi tiếttrang'],
      extra: this.headerExtra(),
      desc: this.headerContent(),
      footer: this.headerFooter()
    };
  }
}
