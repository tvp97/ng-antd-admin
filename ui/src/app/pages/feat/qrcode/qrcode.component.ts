import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent, PageHeaderType } from '@shared/components/page-header/page-header.component';

import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'app-qrcode',
  imports: [NzQRCodeModule, PageHeaderComponent],
  templateUrl: './qrcode.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrcodeComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Mã QR',
    breadcrumb: ['Trang chủ', 'chức năng', 'Mã QR'],
    desc: 'Đừng quét mã QR của người lạ, phòng chống lừa đảo bắt đầu từ tôi. Có thể cân nhắc sử dụnghttps://github.com/cordobo/angularx-qrcodeDự án nàyng16Phiên bản trước đã được cài đặt và sử dụng'
  };
}
