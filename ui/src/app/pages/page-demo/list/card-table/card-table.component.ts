import { Component, ChangeDetectionStrategy, AfterViewInit, TemplateRef, inject, viewChild, computed } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { ThemeService } from '@store/common-store/theme.service';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrl: './card-table.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzGridModule, NzCardModule, NzIconModule, NzButtonModule, NzAvatarModule]
})
export class CardTableComponent implements AfterViewInit {
  private themesService = inject(ThemeService);
  $isOverMode = computed(() => this.themesService.$isOverModeTheme());
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: ''
  };
  list = [
    {
      id: 1,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      name: 'Alipay',
      desc: 'Trong quá trình nghiên cứu và phát triển sản phẩm trung gian, sẽ xuất hiện các tiêu chuẩn thiết kế và cách triển khai khác nhau, nhưng trong số đó thường tồn tại nhiều trang và thành phần tương tự, những thành phần tương tự này sẽ được tách ra thành một bộ tiêu chuẩn.'
    },
    {
      id: 2,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      name: 'Angular',
      desc: 'Trong quá trình nghiên cứu và phát triển sản phẩm trung gian, sẽ xuất hiện các tiêu chuẩn thiết kế và cách triển khai khác nhau, nhưng trong số đó thường tồn tại nhiều trang và thành phần tương tự, những thành phần tương tự này sẽ được tách ra thành một bộ tiêu chuẩn.'
    },
    {
      id: 3,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      name: 'Ant Design',
      desc: 'Trong quá trình nghiên cứu và phát triển sản phẩm trung gian, sẽ xuất hiện các tiêu chuẩn thiết kế và cách triển khai khác nhau, nhưng trong số đó thường tồn tại nhiều trang và thành phần tương tự, những thành phần tương tự này sẽ được tách ra thành một bộ tiêu chuẩn.'
    },
    {
      id: 4,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      name: 'Ant Design Pro',
      desc: 'Trong quá trình nghiên cứu và phát triển sản phẩm trung gian, sẽ xuất hiện các tiêu chuẩn thiết kế và cách triển khai khác nhau, nhưng trong số đó thường tồn tại nhiều trang và thành phần tương tự, những thành phần tương tự này sẽ được tách ra thành một bộ tiêu chuẩn.'
    },
    {
      id: 5,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      name: 'Bootstrap',
      desc: 'Trong quá trình nghiên cứu và phát triển sản phẩm trung gian, sẽ xuất hiện các tiêu chuẩn thiết kế và cách triển khai khác nhau, nhưng trong số đó thường tồn tại nhiều trang và thành phần tương tự, những thành phần tương tự này sẽ được tách ra thành một bộ tiêu chuẩn.'
    },
    {
      id: 6,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
      name: 'React',
      desc: 'Trong quá trình nghiên cứu và phát triển sản phẩm trung gian, sẽ xuất hiện các tiêu chuẩn thiết kế và cách triển khai khác nhau, nhưng trong số đó thường tồn tại nhiều trang và thành phần tương tự, những thành phần tương tự này sẽ được tách ra thành một bộ tiêu chuẩn.'
    },
    {
      id: 7,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
      name: 'Vue',
      desc: 'Trong quá trình nghiên cứu và phát triển sản phẩm trung gian, sẽ xuất hiện các tiêu chuẩn thiết kế và cách triển khai khác nhau, nhưng trong số đó thường tồn tại nhiều trang và thành phần tương tự, những thành phần tương tự này sẽ được tách ra thành một bộ tiêu chuẩn.'
    },
    {
      id: 8,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
      name: 'Webpack',
      desc: 'Trong quá trình nghiên cứu và phát triển sản phẩm trung gian, sẽ xuất hiện các tiêu chuẩn thiết kế và cách triển khai khác nhau, nhưng trong số đó thường tồn tại nhiều trang và thành phần tương tự, những thành phần tương tự này sẽ được tách ra thành một bộ tiêu chuẩn.'
    }
  ];
  readonly headerContent = viewChild.required<TemplateRef<NzSafeAny>>('headerContent');

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Danh sách thẻ',
      breadcrumb: ['Trang chủ', 'Trang danh sách', 'Danh sách thẻ'],
      desc: this.headerContent()
    };
  }
}
