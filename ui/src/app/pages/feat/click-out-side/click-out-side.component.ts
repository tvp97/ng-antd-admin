import { Component, ChangeDetectionStrategy, AfterViewInit, ElementRef, inject, DestroyRef, viewChild, DOCUMENT, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { fnStopMouseEvent } from '@utils/tools';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-click-out-side',
  templateUrl: './click-out-side.component.html',
  styleUrl: './click-out-side.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent]
})
export class ClickOutSideComponent implements AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Chạm vào các sự kiện kích hoạt bên trong và bên ngoài, chạm một lần sẽ luôn gặp may mắn',
    breadcrumb: ['Trang chủ', 'chức năng', 'clickOutSide']
  };
  destroyRef = inject(DestroyRef);
  text = signal('Nhấp vào bên trong hoặc bên ngoài');
  winClick$!: Observable<Event>; // Liên kếtwindowcủaclicksự kiện
  readonly targetHtml = viewChild.required<ElementRef>('targetHtml');
  targetHtmlClick$!: Observable<NzSafeAny>;

  private doc = inject(DOCUMENT);

  ngAfterViewInit(): void {
    this.targetHtmlClick$ = fromEvent(this.targetHtml().nativeElement, 'click').pipe(
      tap(e => {
        fnStopMouseEvent(e as MouseEvent);
        this.text.set('Đao chém thân xác');
      })
    );
    this.winClick$ = fromEvent(this.doc, 'click').pipe(
      tap(() => {
        this.text.set('Chém linh hồn');
      })
    );
    merge(this.targetHtmlClick$, this.winClick$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
