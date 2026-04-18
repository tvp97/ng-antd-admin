import { Component } from '@angular/core';

import { PageHeaderComponent, PageHeaderType } from '@shared/components/page-header/page-header.component';

import { NzCardComponent } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-blingbling',
  imports: [PageHeaderComponent, NzCardComponent],
  templateUrl: './blingbling.component.html',
  styleUrl: './blingbling.component.less'
})
export class BlingblingComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Không linh nghiệm',
    breadcrumb: ['Trang chủ', 'Thành phần', 'blingbling'],
    desc: 'Sao chép một kiểu https://mp.weixin.qq.com/s/CaMKgC4EwBGkmsGK9yh0hA'
  };
}
