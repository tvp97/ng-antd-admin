import { BreakpointObserver } from '@angular/cdk/layout';
import { DestroyRef, Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/*Các thành phần không hiển thị khi độ rộng màn hình nhỏ hơn một độ rộng nhất định*/
@Directive({
  selector: '[appScreenLessHidden]',
})
export class ScreenLessHiddenDirective {
  readonly appScreenLessHidden = input('', { transform: appendPx });

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect((onCleanup) => {
      const query = `(max-width: ${this.appScreenLessHidden()})`;
      const sub = this.breakpointObserver.observe([query]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
        result.matches ? this.viewContainerRef.clear() : this.viewContainerRef.createEmbeddedView(this.templateRef);
      });
      onCleanup(() => sub.unsubscribe());
    });
  }
}

function appendPx(value: number): string {
  return `${value}px`;
}
