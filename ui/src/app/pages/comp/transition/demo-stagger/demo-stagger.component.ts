import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';

interface StaggerItem {
  label: string;
  color: string;
}

@Component({
  selector: 'app-demo-stagger',
  templateUrl: './demo-stagger.component.html',
  styleUrl: './demo-stagger.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzButtonModule, NzWaveModule, NzCardModule, NzGridModule, NzTagModule, NzDividerModule]
})
export class DemoStaggerComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly cardItems: StaggerItem[] = [
    { label: 'Thiết kế', color: '#1890ff' },
    { label: 'phát triển', color: '#52c41a' },
    { label: 'kiểm tra', color: '#fa8c16' },
    { label: 'triển khai', color: '#722ed1' },
    { label: 'giám sát', color: '#eb2f96' },
    { label: 'lặp đi lặp lại', color: '#13c2c2' }
  ];

  readonly listItems: StaggerItem[] = [
    { label: 'Dữ liệu đầu tiên đã tải xong', color: '#1890ff' },
    { label: 'Dữ liệu thứ hai đã tải xong', color: '#52c41a' },
    { label: 'Dữ liệu của mục thứ ba đã được tải xong', color: '#fa8c16' },
    { label: 'Dữ liệu của mục thứ tư đã được tải xong', color: '#722ed1' },
    { label: 'Điều 5 dữ liệu đã tải xong', color: '#eb2f96' }
  ];

  visibleCards = signal<StaggerItem[]>([]);
  visibleList = signal<StaggerItem[]>([]);

  playCards(): void {
    this.visibleCards.set([]);
    timer(50).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.visibleCards.set(this.cardItems);
    });
  }

  playList(): void {
    this.visibleList.set([]);
    timer(50).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.visibleList.set(this.listItems);
    });
  }
}
