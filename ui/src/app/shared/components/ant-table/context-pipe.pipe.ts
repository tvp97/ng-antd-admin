import { Pipe, PipeTransform } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

/*
 * Dùng để gọitableKhi đó, lấy dữ liệu của từng cột, và chỉ định ngữ cảnh
 * */
@Pipe({
  name: 'contextPipe',
})
export class ContextPipePipe implements PipeTransform {
  transform(row: NzSafeAny, key: string): NzSafeAny {
    return { ...row, [key]: row };
  }
}
