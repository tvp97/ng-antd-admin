import {
  ComponentRef,
  Directive,
  Type,
  ViewContainerRef,
  TemplateRef,
  inject,
  input,
  effect,
  ChangeDetectorRef
} from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

/*<ng-container *viewOutlet="counterComponent; context: { count: count, from: 'Component' }"></ng-container>

<ng-container *viewOutlet="counter; context: { count: count, from: 'Template' }"></ng-container>

  <ng-template #counter let-count="count" let-from="from">
  <p>{{ count }}</p>
<p>{{ from }}</p>
</ng-template>*/

/**
 * Chế độ xem Outlet Các thành phần, thay thế NgComponentOutlet và NgTemplateOutlet
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[viewOutlet]',
})
export class ViewOutletDirective {
  private componentRef: ComponentRef<NzSafeAny> | undefined;

  /**
   * Thành phần hoặc mẫu TemplateRef
   */
  readonly viewOutlet = input<Type<NzSafeAny> | TemplateRef<NzSafeAny> | null>(null);

  /**
   * Truyền dữ liệu giữa các thành phần và ngữ cảnh mẫu
   */
  readonly viewOutletContext = input<NzSafeAny>();

  private readonly viewContainerRef = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const outlet = this.viewOutlet();
      const context = this.viewOutletContext();
      const { viewContainerRef } = this;

      viewContainerRef.clear();
      this.componentRef = undefined;

      if (!outlet) return;

      if (outlet instanceof TemplateRef) {
        viewContainerRef.createEmbeddedView(outlet, context);
      } else {
        this.componentRef = viewContainerRef.createComponent(outlet, {
          index: viewContainerRef.length
        });
        if (context) {
          this.updateContext(this.componentRef.instance, context);
          this.componentRef.injector.get(ChangeDetectorRef).markForCheck();
        }
      }
    });
  }

  private updateContext(instance: NzSafeAny, context: NzSafeAny): void {
    Object.keys(context).forEach(key => {
      instance[key] = context[key];
    });
  }
}
