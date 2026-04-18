import { Component, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ColorPickerDirective } from 'ngx-color-picker';

import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-color-sel',
  templateUrl: './color-sel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, ColorPickerDirective]
})
export class ColorSelComponent {
  public color = '#2889e9';
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Tôi đột nhiên nghĩ đến câu lời bài hát Nhưng em lại nói thế giới hoa lệ không cần phải nghiêm túc',
    desc: 'Cũng có thể chọn:https://zefoy.github.io/ngx-color-picker/ Mã ví dụ ởv20Trước đây đều đã cung cấp',
    breadcrumb: ['Trang chủ', 'chức năng', 'Bộ chọn màu']
  };
}
