import { Component, ChangeDetectionStrategy, inject, DOCUMENT } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzScrollService } from 'ng-zorro-antd/core/services';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzGridModule } from 'ng-zorro-antd/grid';

/*https://segmentfault.com/a/1190000020769492*/
@Component({
  selector: 'app-play-scroll',
  templateUrl: './play-scroll.component.html',
  styleUrl: './play-scroll.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, NzGridModule, NzButtonModule, NzWaveModule]
})
export class PlayScrollComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Chơi với thanh cuộn',
    breadcrumb: ['Trang chủ', 'Mở rộng chức năng', 'Chơi với thanh cuộn'],
    desc: 'Truyền rằng có một cậu thiếu niên cưỡi xe điện đi mua dưa'
  };
  private scrollService = inject(NzScrollService);
  private _doc = inject(DOCUMENT);

  toDocBottom(): void {
    this.scrollService.scrollTo(null, this._doc.body.scrollHeight);
  }

  toDoc100(): void {
    this.scrollService.scrollTo(null, 100);
  }

  toBox1(): void {
    this.scrollService.scrollTo(this._doc.querySelector('#div-scroll3'), 100);
  }

  toBox2(): void {
    this.scrollService.scrollTo(this._doc.querySelector('#div-scroll4'), 100);
  }

  toDocHead(): void {
    this.scrollService.scrollTo(null, 0);
  }
}
