// https://www.thinktecture.com/angular/view-transition-api-integration-in-angular-a-brave-new-world-part-1/
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ViewTransitionDirective } from '@shared/directives/view-transition.directive';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';

export interface TechItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  color: string;
  tags: string[];
  desc: string;
}

export const TECH_ITEMS: TechItem[] = [
  {
    id: 1,
    title: 'Angular Signals',
    subtitle: 'Phản hồi tinh vi',
    imageUrl: 'https://angular.dev/assets/images/ng-image.jpg',
    color: '#dd0031',
    tags: ['Phản hồi', 'hiệu suất', 'Zoneless'],
    desc: 'Signals là Angular Các nguyên thủy phản ứng hạt mịn được giới thiệu, giúp phát hiện thay đổi chính xác hơn và hiệu quả hơn. Không cần Zone.jsCác thành phần chỉ được render lại khi dữ liệu thực sự phụ thuộc thay đổi.'
  },
  {
    id: 2,
    title: 'View Transitions API',
    subtitle: 'Chuyển tiếp trang gốc',
    imageUrl: 'https://angular.dev/assets/images/ng-image.jpg',
    color: '#1890ff',
    tags: ['hoạt hình', 'Bộ định tuyến', 'UX'],
    desc: 'View Transitions API Là khả năng chuyển tiếp trang được trình duyệt hỗ trợ nguyên bản.Angular 17+ qua withViewTransitions() Tích hợp sâu với định tuyến, thực hiện hoạt ảnh phần tử chia sẻ không cần cấu hình.'
  },
  {
    id: 3,
    title: 'Deferrable Views',
    subtitle: 'Tải theo nhu cầu',
    imageUrl: 'https://angular.dev/assets/images/ng-image.jpg',
    color: '#52c41a',
    tags: ['hiệu suất', 'Tải lười', 'Mẫu'],
    desc: '@defer Khối cho phép bạn hoãn việc tải các thành phần đến khi thật sự cần, hỗ trợ on viewport、on interaction Đợi nhiều điều kiện kích hoạt khác nhau, nâng cao đáng kể hiệu suất màn hình chính.'
  },
  {
    id: 4,
    title: 'Control Flow',
    subtitle: 'Cú pháp điều khiển luồng tích hợp sẵn',
    imageUrl: 'https://angular.dev/assets/images/ng-image.jpg',
    color: '#722ed1',
    tags: ['Mẫu', 'Ngữ pháp', 'hiệu suất'],
    desc: '@if、@for、@switch thay thế *ngIf、*ngFor Cấu trúc lệnh đợi, cú pháp trực quan hơn, hiệu quả tốt hơn và không cần nhập thêm mô-đun.'
  },
  {
    id: 5,
    title: 'SSR & Hydration',
    subtitle: 'Kết xuất phía máy chủ',
    imageUrl: 'https://angular.dev/assets/images/ng-image.jpg',
    color: '#fa8c16',
    tags: ['SSR', 'SEO', 'hiệu suất'],
    desc: 'Angular sự thủy hợp tăng dần (Incremental Hydration）để kết xuất phía máy chủ HTML Có thể kích hoạt theo nhu cầu, tránh việc kết xuất lại toàn bộ, cải thiện rõ rệt LCP và TTI Chỉ số.'
  },
  {
    id: 6,
    title: 'Zoneless Angular',
    subtitle: 'Không có Zone.js chế độ',
    imageUrl: 'https://angular.dev/assets/images/ng-image.jpg',
    color: '#13c2c2',
    tags: ['hiệu suất', 'thí nghiệm', 'Signals'],
    desc: 'qua provideZonelessChangeDetection()，Angular hoàn toàn thoát khỏi sự phụ thuộc vào Zone.js sự phụ thuộc, việc kiểm tra thay đổi hoàn toàn do Signals Trình điều khiển, kích thước gói nhỏ hơn, hiệu suất mạnh hơn.'
  }
];

@Component({
  selector: 'app-transitions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, ViewTransitionDirective, NzCardModule, NzGridModule, NzTagModule],
  templateUrl: './transitions.html',
  styleUrl: './transitions.less'
})
export class Transitions {
  private router = inject(Router);
  readonly pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'View Transition API',
    breadcrumb: ['Trang chủ', 'chức năng', 'View Transition API'],
    desc: 'sử dụng Angular withViewTransitions() Thực hiện hoạt ảnh chuyển tiếp phần tử chia sẻ cấp độ tuyến đường, bấm vào thẻ để trải nghiệm hiệu ứng.'
  };

  readonly items = TECH_ITEMS;

  toDetail(id:number) {
    this.router.navigate(['default/feat/transitions/transitions-detail'], { queryParams: { id } });
  }
}
