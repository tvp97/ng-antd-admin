import { Directive, TemplateRef, inject, input, signal, effect } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

/**
 * Lấy tên mẫu
 *
 * @example
 * ``` html
 * <ng-template named="test"></ng-template>
 * <ng-template #test named></ng-template>
 *
 * ```
 * ``` javascript
 * @Component(...)
 * export class TestComponent {
 *   @ViewChildren(NamedTemplate) list!: QueryList<NamedTemplate>;
 *
 *   trace() {
 *     this.list.forEach(it => {
 *       console.log(it.named());
 *       console.log(it.template);
 *     });
 *   }
 * }
 * ```
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[named]',
})
export class NamedTemplate<T> {
  template = inject<TemplateRef<T>>(TemplateRef);

  /**
   * Tên mẫu
   */
  readonly namedInput = input<string>('', { alias: 'named' });

  /**
   * Tên mẫu đã phân tích (fallback đến tên biến mẫu)
   */
  readonly named = signal<string>('');

  constructor() {
    effect(() => {
      const name = this.namedInput();
      if (name) {
        this.named.set(name);
      } else {
        const tplRef = this.template as NzSafeAny;
        // localNamesđối với mảng, Nếu không cónamethì lànull
        this.named.set(tplRef._declarationTContainer.localNames?.[0] ?? '');
      }
    });
  }
}
