import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, booleanAttribute, ChangeDetectionStrategy, Component, TemplateRef, input, output, contentChild, computed } from '@angular/core';

import { AntTreeTableComponentToken } from '@shared/components/tree-table/tree-table.component';
import { ScreenLessHiddenDirective } from '@shared/directives/screen-less-hidden.directive';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableSize } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { AntTableComponentToken, TableHeader } from '../ant-table/ant-table.component';

interface TableSizeItem {
  sizeName: string;
  selected: boolean;
  value: NzTableSize;
}

@Component({
  selector: 'app-card-table-wrap',
  templateUrl: './card-table-wrap.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzCardModule,
    NgTemplateOutlet,
    NzDividerModule,
    NzSpaceModule,
    NzIconModule,
    NzButtonModule,
    NzPopoverModule,
    NzTooltipModule,
    NzDropdownModule,
    NzMenuModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    NzCheckboxModule,
    ScreenLessHiddenDirective
]
})
export class CardTableWrapComponent implements AfterContentInit {
  readonly tableTitle = input<string | TemplateRef<NzSafeAny>>();
  readonly btnTpl = input<TemplateRef<NzSafeAny>>();
  readonly isNormalTable = input(true, { transform: booleanAttribute }); // Nếu chỉ cầncard-table-wrapkiểu dáng, ở đây thiết lập thànhfalse
  readonly reload = output();
  readonly antTableComponent = contentChild(AntTableComponentToken);
  readonly antTreeTableComponent = contentChild(AntTreeTableComponentToken);
  tableConfigVisible = false;
  tableSizeOptions: TableSizeItem[] = [
    { sizeName: 'Mặc định', selected: true, value: 'default' },
    { sizeName: 'Trung bình', selected: false, value: 'middle' },
    { sizeName: 'gọn gàng', selected: false, value: 'small' }
  ];
  tableHeaders: TableHeader[] = [];

  // Gói hàng hiện tạitableThành phần
  currentTableComponent = computed(() => {
    const tableComponent = this.antTableComponent() || this.antTreeTableComponent();
    if (!tableComponent) {
      throw new Error('Không cóantTableComponenthoặcantTreeTableComponentNhư là một thành phần chiếu');
    }
    return tableComponent;
  });

  allTableFieldChecked = false; // Chọn tất cả cột trong cài đặt
  allTableFieldIndeterminate = false; // Trạng thái chọn một phần của toàn bộ cột trong cài đặt
  copyHeader: TableHeader[] = []; // Cấu hình mặc định của bộ nhớ đệm

  // Có hiển thị hộp kiểm không
  changeTableCheckBoxShow(e: boolean): void {
    this.currentTableComponent().tableConfig().showCheckbox = e;
    this.tableChangeDectction();
  }

  // Mật độ bảng lớn, vừa và nhỏ
  tableSizeMenuClick(item: TableSizeItem): void {
    this.tableSizeOptions.forEach(tableSizeItem => (tableSizeItem.selected = false));
    item.selected = true;
    this.currentTableComponent().tableSize = item.value;
  }

  // Đang cấu hìnhtableCheckboxCó chọn tất cả không
  changeAllTableTableConfigShow(e: boolean): void {
    if (e) {
      this.allTableFieldChecked = e;
      this.allTableFieldIndeterminate = false;
    }
    this.tableHeaders.forEach(item => (item.show = e));
    this.tableChangeDectction();
  }

  // Cài đặt cố định bên trái hay bên phải
  changeTableConfigShow(): void {
    const tempArray = [...this.tableHeaders];
    const fixedLeftArray: TableHeader[] = [];
    const fixedRightArray: TableHeader[] = [];
    const noFixedArray: TableHeader[] = [];
    tempArray.forEach(item => {
      if (item.fixed) {
        if (item.fixedDir === 'left') {
          fixedLeftArray.push(item);
        } else {
          fixedRightArray.push(item);
        }
      } else {
        noFixedArray.push(item);
      }
    });
    this.currentTableComponent().tableConfig().headers = [...fixedLeftArray, ...noFixedArray, ...fixedRightArray];
    this.tableChangeDectction();
  }

  dropTableConfig(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.tableHeaders, event.previousIndex, event.currentIndex);
    this.changeTableConfigShow();
  }

  fixedTableHead(dir: 'right' | 'left', item: TableHeader): void {
    item.fixed = !(item.fixed && item.fixedDir === dir);
    item.fixedDir = dir;
    this.changeTableConfigShow();
  }

  reloadClick(): void {
    this.reload.emit();
  }

  // Một cột nào đócheckbiến hóa
  changeSignalCheck(e: boolean, item: TableHeader): void {
    item.show = e;
    this.judgeAllChecked();
    this.tableChangeDectction();
  }

  // Cho phép phát hiện thay đổi danh sách con
  tableChangeDectction(): void {
    this.currentTableComponent().tableChangeDectction();
  }

  // Cột đánh giá hiển thị cái nàycheckboxtrạng thái
  judgeAllChecked(): void {
    this.allTableFieldChecked = this.tableHeaders.every(item => item.show === true);
    const allUnChecked = this.tableHeaders.every(item => !item.show);
    this.allTableFieldIndeterminate = !this.allTableFieldChecked && !allUnChecked;
  }

  // Đặt lại
  reset(): void {
    this.tableHeaders = [];
    this.copyHeader.forEach(item => {
      this.tableHeaders.push({ ...item });
    });
    this.currentTableComponent().tableConfig().headers = [...this.tableHeaders];
    this.tableChangeDectction();
  }

  ngAfterContentInit(): void {
    if (this.isNormalTable()) {
      this.tableHeaders = [...this.currentTableComponent().tableConfig().headers];
      this.tableHeaders.forEach(item => {
        if (item.show === undefined) {
          item.show = true;
        }
      });
      this.copyHeader.length = 0;
      this.tableHeaders.forEach(item => {
        this.copyHeader.push({ ...item });
      });
      this.judgeAllChecked();
    }
  }
}
