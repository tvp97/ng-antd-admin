import { Component, ChangeDetectionStrategy, AfterViewInit, inject, viewChild } from '@angular/core';

import { LazyServiceService } from '@app/pages/comp/lazy/lazy-service.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AdDirective } from '@shared/directives/ad.directive';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';

@Component({
  selector: 'app-lazy-basic',
  templateUrl: './lazy-basic.component.html',
  styleUrl: './lazy-basic.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LazyServiceService],
  imports: [PageHeaderComponent, NzButtonModule, NzWaveModule, AdDirective]
})
export class LazyBasicComponent implements AfterViewInit {
  lazyServiceService = inject(LazyServiceService);
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ về thành phần tải lười',
    breadcrumb: ['Trang chủ', 'Thành phần', 'Thành phần tải lười'],
    desc: 'Thành phần tải lười,Tôi không còn thích người nổi tiếng nữa'
  };
  readonly adHost = viewChild.required(AdDirective);
  isStarted = false;

  ngAfterViewInit(): void {
    this.lazyServiceService.adHost = this.adHost();
  }
}
