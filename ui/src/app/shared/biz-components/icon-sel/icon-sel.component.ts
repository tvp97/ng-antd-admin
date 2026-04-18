
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, inject, DestroyRef, booleanAttribute, output, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { zorroIcons } from '@shared/biz-components/icon-sel/zorro-icons';
import { fnKebabCase } from '@utils/camelFn';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

interface IconItem {
  icon: string;
  isChecked: boolean;
}

@Component({
  selector: 'app-icon-sel',
  templateUrl: './icon-sel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, NzButtonModule, NzPopoverModule, NzInputModule, NzCardModule, NzEmptyModule, NzPaginationModule]
})
export class IconSelComponent implements OnInit, AfterViewInit {
  visible = input(false, { transform: booleanAttribute });
  // Tạo biểu tượngTìm kiếmchống rung
  private searchText$ = new Subject<string>();
  selectedIcon = '';
  readonly selIcon = output<string>();
  // Thông tin phân trang
  pageObj = {
    pageSize: 50,
    pageIndex: 1
  };
  // Biểu tượngTìm kiếmTất cả kết quả đưa ra
  iconsStrAllArray: IconItem[] = [];
  sourceIconsArray: IconItem[] = []; // tất cảiconnguồn dữ liệu
  iconsStrShowArray: IconItem[] = []; // Hiển thị trên mỗi trangicon
  gridStyle = {
    width: '20%'
  };
  destroyRef = inject(DestroyRef);

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    zorroIcons.forEach(item => {
      this.sourceIconsArray.push({ icon: fnKebabCase(item), isChecked: false });
    });
    this.iconsStrAllArray = JSON.parse(JSON.stringify(this.sourceIconsArray));
  }

  searchIcon(e: Event): void {
    this.searchText$.next((e.target as HTMLInputElement).value);
  }

  selIconFn(item: IconItem): void {
    this.selectedIcon = item.icon;
    [this.sourceIconsArray, this.iconsStrShowArray, this.iconsStrAllArray].forEach(item => {
      item.forEach(icon => (icon.isChecked = false));
    });
    item.isChecked = true;
    this.selIcon.emit(item.icon);
  }

  pageSizeChange(event: number): void {
    this.pageObj = { ...this.pageObj, pageSize: event };
    this.getData(1);
  }

  // Lấy dữ liệu theo phân trang
  getData(event: number = this.pageObj.pageIndex): void {
    this.pageObj = { ...this.pageObj, pageIndex: event };
    this.iconsStrShowArray = [...this.iconsStrAllArray.slice((this.pageObj.pageIndex - 1) * this.pageObj.pageSize, this.pageObj.pageIndex * this.pageObj.pageSize)];
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    this.searchText$.pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.iconsStrAllArray = this.sourceIconsArray.filter(item => item.icon.includes(res));
      this.getData();
      this.cdr.markForCheck();
    });
  }
}
