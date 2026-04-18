import { Component, ChangeDetectionStrategy, AfterViewInit, inject } from '@angular/core';

import { LazyService } from '@core/services/common/lazy.service';

@Component({
  selector: 'app-luckysheet',
  templateUrl: './luckysheet.component.html',
  styleUrl: './luckysheet.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LuckysheetComponent implements AfterViewInit {
  private lazyService = inject(LazyService);

  ngAfterViewInit(): void {
    this.lazyService
      .load([
        'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/css/pluginsCss.css',
        'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/plugins.css',
        'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/css/luckysheet.css',
        'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/assets/iconfont/iconfont.css',
        'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/js/plugin.js',
        'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js'
      ])
      .then(() => {
        const options = {
          userName: 'NgAntAdmin', // Tên đăng nhập
          myFolderUrl: 'https://github.com/huajian123/ng-antd-admin',
          container: 'luckysheet',
          title: 'Ví dụ đơn giản', // Đặt tên bảng
          lang: 'zh' // Đặt ngôn ngữ bảng
        };
        // @ts-ignore
        luckysheet.create(options);
      });
  }
}
