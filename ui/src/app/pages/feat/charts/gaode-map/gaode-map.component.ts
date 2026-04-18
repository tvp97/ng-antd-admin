import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import AMapLoader from '@amap/amap-jsapi-loader';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-gaode-map',
  templateUrl: './gaode-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, NzInputModule, FormsModule]
})
export class GaodeMapComponent implements AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Bản đồ Gaode, Gaode đã gọi điện cho tôi, tôi nàykeyĐã hủy đăng ký, tôi sẽ giữ lại mã nguồn ở đây để các bạn tham khảo, của riêng tôikeyThì không bị lộ ra nữa',
    breadcrumb: ['Trang chủ', 'chức năng', 'Biểu đồ', 'Bản đồ Gaode']
  };
  marker: [number, number] = [116.437253, 39.935033];
  markerPosition: string = this.marker.join(',');

  ngAfterViewInit(): void {
    // apiĐịa chỉ
    // https://lbs.amap.com/demo/javascript-api/example/map-lifecycle/map-show
    // Tự mình đi xin một cáikey, đừng dùng cái này của tôiKeyCảm ơn nhiều. Gaode đã gọi điện cho tôi, tôi nàyKeyĐã hủy đăng ký, tôi sẽ giữ lại phương pháp sử dụng ở đây, nhưng sẽ không hiển thị ra.
    // Địa chỉ đăng ký https://console.amap.com/dev/key/app
    AMapLoader.load({
      key: 'xxxxxxxxxxxxx', //lần đầuloadBắt buộc
      version: '1.4.15',
      AMapUI: {
        version: '1.1',
        plugins: ['overlay/SimpleMarker']
      }
    })
      .then(AMap => {
        const map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 11,
          center: [116.397428, 39.90923]
        });

        const marker = new AMap.Marker({
          position: new AMap.LngLat(this.marker[0], this.marker[1]), // Đối tượng kinh độ vĩ độ, cũng có thể là mảng một chiều được cấu thành từ kinh độ vĩ độ[116.39, 39.9]
          /*  title: 'Nam Kinh',*/
          draggable: true
        });
        marker.on('dragend', () => {
          this.marker = [marker.getPosition()['R'], marker.getPosition()['Q']];
          this.markerPosition = this.marker.join(',');
          console.log(this.markerPosition);
        });
        marker.setMap(map);
      })
      .catch(e => {
        console.error(e);
      });
  }
}
