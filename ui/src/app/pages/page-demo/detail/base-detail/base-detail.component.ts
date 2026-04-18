import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, viewChild } from '@angular/core';

import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';

interface ReturnObj {
  num: string;
  name: string;
  code: string;
  unitPrice: string;
  number: string;
  price: string;
}

@Component({
  selector: 'app-base-detail',
  templateUrl: './base-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, NzDescriptionsModule, NzDividerModule, AntTableComponent]
})
export class BaseDetailComponent implements OnInit {
  readonly returnProductTpl = viewChild.required<TemplateRef<NzSafeAny>>('returnProductTpl');
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Cơ sởChi tiếttrang',
    breadcrumb: ['Trang chủ', 'Chi tiếttrang', 'Cơ sởChi tiếttrang']
  };
  returnTableConfig!: AntTableConfig;
  returnTableConfig2!: AntTableConfig;
  returnDataList: ReturnObj[] = [
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    }
  ];

  private initReturnTable(): void {
    this.returnTableConfig = {
      showCheckbox: false,
      headers: [
        {
          title: 'Mã sản phẩm',
          field: 'num',
          width: 150,
          tdTemplate: this.returnProductTpl()
        },
        {
          title: 'Tên sản phẩm',
          width: 160,
          field: 'name'
        },
        {
          title: 'Mã vạch sản phẩm',
          width: 150,
          field: 'code'
        },
        {
          title: 'Đơn giá',
          width: 150,
          field: 'unitPrice'
        },
        {
          title: 'Số lượng (chiếc)',
          width: 150,
          field: 'number'
        },
        {
          title: 'Số tiền',
          field: 'price'
        }
      ],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
    this.returnTableConfig2 = {
      showCheckbox: false,
      headers: [
        {
          title: 'Mã sản phẩm',
          field: 'num',
          width: 150,
          tdTemplate: this.returnProductTpl()
        },
        {
          title: 'Tên sản phẩm',
          width: 160,
          field: 'name'
        },
        {
          title: 'Mã vạch sản phẩm',
          width: 150,
          field: 'code'
        },
        {
          title: 'Đơn giá',
          width: 150,
          field: 'unitPrice'
        },
        {
          title: 'Số lượng (chiếc)',
          width: 150,
          field: 'number'
        },
        {
          title: 'Số tiền',
          field: 'price'
        }
      ],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnInit(): void {
    this.initReturnTable();
  }
}
