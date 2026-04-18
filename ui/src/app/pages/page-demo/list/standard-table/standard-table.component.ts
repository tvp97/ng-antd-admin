import { Component, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzProgressModule, NzProgressStatusType } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSpaceCompactComponent } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-standard-table',
  templateUrl: './standard-table.component.html',
  styleUrl: './standard-table.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzCardModule,

    NzGridModule,
    NzStatisticModule,
    NzDividerModule,
    NzRadioModule,
    NzButtonModule,
    NzInputModule,
    NzWaveModule,
    NzIconModule,
    NzListModule,
    NzProgressModule,
    NzDropdownModule,
    NzMenuModule,
    NzPaginationModule,
    NzSpaceCompactComponent
  ]
})
export class StandardTableComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Danh sách tiêu chuẩn',
    breadcrumb: ['Trang chủ', 'Trang danh sách', 'Danh sách tiêu chuẩn']
  };
  isSpinning = false;
  list: Array<{
    id: number;
    name: string;
    desc: string;
    avatar: string;
    owner: string;
    owner_id: string;
    time: string;
    progress: number;
    progress_status: NzProgressStatusType;
  }> = [
      {
        id: 1,
        name: 'Alipay',
        desc: 'Đó là một thứ gì đó bên trong. Họ không thể đến được, cũng không thể chạm tới.',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
        owner: 'Phó Tiểu Tiểu',
        owner_id: '1',
        time: '2020-11-18 15:12',
        progress: 75,
        progress_status: 'active'
      },
      {
        id: 2,
        name: 'Angular',
        desc: 'Hy vọng là một điều tốt, có lẽ là tốt nhất, điều tốt thì không bao giờ biến mất',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
        owner: 'Khúc Lệ Lệ',
        owner_id: '2',
        time: '2020-11-19 07:51',
        progress: 93,
        progress_status: 'exception'
      },
      {
        id: 3,
        name: 'Ant Design',
        desc: 'Cuộc sống giống như một hộp sô cô la, kết quả thường bất ngờ',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
        owner: 'Lâm Đông Đông',
        owner_id: '3',
        time: '2020-11-19 05:51',
        progress: 94,
        progress_status: 'active'
      },
      {
        id: 4,
        name: 'Ant Design Pro',
        desc: 'Biết bao quán trong phố, nàng lại bước vào quán của tôi',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
        owner: 'Châu Tinh Trì',
        owner_id: '4',
        time: '2020-11-19 03:51',
        progress: 93,
        progress_status: 'active'
      },
      {
        id: 5,
        name: 'Bootstrap',
        desc: 'Lúc đó tôi chỉ nghĩ về những gì mình muốn, chưa bao giờ nghĩ về những gì mình có.',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
        owner: 'Ngô Gia Hảo',
        owner_id: '5',
        time: '2020-11-19 01:51',
        progress: 91,
        progress_status: 'exception'
      }
    ];

  edit(item: NzSafeAny): void { }

  deleteItem(item: NzSafeAny): void { }
}
