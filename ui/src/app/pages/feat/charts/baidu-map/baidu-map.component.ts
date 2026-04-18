import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';

import { LazyService } from '@core/services/common/lazy.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

declare let BMap: NzSafeAny;
@Component({
  selector: 'app-baidu-map',
  templateUrl: './baidu-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule]
})
export class BaiduMapComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Bản đồ Baidu, đừng để lộ hành tung nhé',
    breadcrumb: ['Trang chủ', 'chức năng', 'Biểu đồ', 'Bản đồ Baidu']
  };
  private lazyService = inject(LazyService);

  ngOnInit(): void {
    this.lazyService.loadScript('http://api.map.baidu.com/getscript?v=2.0&ak=RD5HkkjTa6uAIDpw7GRFtR83Fk7Wdk0j').then(() => {
      const map = new BMap.Map('map'); //Tạo một phiên bản bản đồ
      const point = new BMap.Point(116.404, 39.915); //Tạo tọa độ điểm
      map.centerAndZoom(point, 15); //Khởi tạo bản đồ, thiết lập tọa độ điểm trung tâm và cấp độ bản đồ
      map.enableScrollWheelZoom(true); //Bật phóng to/thu nhỏ bằng bánh xe chuột
    });
  }
}
