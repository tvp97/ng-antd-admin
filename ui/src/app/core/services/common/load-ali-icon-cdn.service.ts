import { inject, Injectable } from '@angular/core';

import { NzIconService } from 'ng-zorro-antd/icon';

// Lấy thư viện biểu tượng của Alibaba
@Injectable({
  providedIn: 'root'
})
export class LoadAliIconCdnService {
  private iconService = inject(NzIconService);

  load(): void {
    // Cái nàyjsBạn phải tự truy cập vào trang web chính thức của Thư viện biểu tượng Alibaba để tự tạo.
    this.iconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_3303907_htrdo3n69kc.js'
    });
  }
}
