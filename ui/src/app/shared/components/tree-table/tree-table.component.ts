import { NgTemplateOutlet } from '@angular/common';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges, inject, input, InputSignal, output, computed } from '@angular/core';

import { AntTableConfig, SortFile, TableHeader } from '@shared/components/ant-table/ant-table.component';
import { fnGetFlattenTreeDataByMap, fnTreeDataToMap } from '@utils/treeTableTools';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzResizeEvent, NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzTableQueryParams, NzTableSize, NzTableModule } from 'ng-zorro-antd/table';

import { MapPipe } from '../../pipes/map.pipe';
import { TableFiledPipe } from '../../pipes/table-filed.pipe';

export interface TreeNodeInterface {
  id: string | number;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;

  [key: string]: NzSafeAny;
}

export abstract class AntTreeTableComponentToken {
  tableSize!: NzTableSize;
  tableConfig!: InputSignal<AntTableConfig>;

  abstract tableChangeDectction(): void;
}

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrl: './tree-table.component.less',
  providers: [{ provide: AntTreeTableComponentToken, useExisting: TreeTableComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzTableModule, NzResizableModule, NgTemplateOutlet, MapPipe, TableFiledPipe]
})
export class TreeTableComponent implements OnChanges {
  private cdr = inject(ChangeDetectorRef);

  // _dataList!: TreeNodeInterface[];
  allChecked = false;
  indeterminate = false;
  // Đã được chọn trong bộ nhớ đệm truyền từ thành phần kinh doanhcheckboxmảng dữ liệu,Tương đương với bộ nhớ đệmtableData
  readonly cashArray = input<NzSafeAny[]>([]);
  checkedCashArrayFromComment: NzSafeAny[] = [];
  readonly sortFn = output<SortFile>();
  readonly changePageIndex = output<NzTableQueryParams>();
  readonly changePageSize = output<number>();
  mapOfExpandedData: Record<string, TreeNodeInterface[]> = {};
  readonly tableConfig = input.required<AntTableConfig>();
  readonly selectedChange = output<NzSafeAny[]>();
  cashExpandIdArray: Array<number | string> = []; // Bộ nhớ đệm của các nút đã mở rộngid

  tableData = input<TreeNodeInterface[]>([]);
  _dataList = computed(() => {
    // theodataListlấymaphình thứctreeData,MỗikeyTương ứng với một tập hợp (tức là có tập con) dữ liệu
    this.mapOfExpandedData = fnTreeDataToMap(this.tableData());
    const beFilterId: Array<string | number> = []; // ĐợiXóadữ liệu khai triển củachildtậpidMảng
    Object.values(this.mapOfExpandedData).forEach(menuArray => {
      menuArray.forEach(menuItem => {
        if (this.cashExpandIdArray.includes(menuItem.id)) {
          menuItem.expand = true;
          // Để tập con của nút hiện tại được lưu vào bộ nhớ đệm, nếu không sẽ xuất ra dư thừa các dữ liệu con có expand là true ở cùng cấp độ
          if (menuItem.children && menuItem.children.length > 0) {
            menuItem.children.forEach(item => {
              beFilterId.push(item.id);
            });
          }
        }
      });
    });
    beFilterId.forEach(item => {
      delete this.mapOfExpandedData[item];
    });
    return this.tableData();
  });

  _tableSize: NzTableSize = 'default';
  set tableSize(value: NzTableSize) {
    this._tableSize = value;
    this.tableChangeDectction();
  }

  get tableSize(): NzTableSize {
    return this._tableSize;
  }

  tableChangeDectction(): void {
    // Thay đổi tham chiếu sẽ kích hoạt kiểm tra thay đổi.
    // this._dataList = [...this._dataList];
    this.cdr.markForCheck();
  }

  // Kéo đầu bảng
  onResize(nzResizeEvent: NzResizeEvent, col: string): void {
    this.tableConfig().headers = this.tableConfig().headers.map(e =>
      e.title === col
        ? {
            ...e,
            width: +`${nzResizeEvent.width}`
          }
        : e
    ) as TableHeader[];
  }

  // Nhấp để sắp xếp
  changeSort(tableHeader: TableHeader): void {
    this.tableConfig().headers.forEach(item => {
      if (item.field !== tableHeader.field) {
        item.sortDir = undefined;
      }
    });
    const sortDicArray: [undefined, 'asc', 'desc'] = [undefined, 'asc', 'desc'];
    const index = sortDicArray.findIndex(item => item === tableHeader.sortDir);
    tableHeader.sortDir = index === sortDicArray.length - 1 ? sortDicArray[0] : sortDicArray[index + 1];
    this.sortFn.emit({ fileName: tableHeader.field!, sortDir: tableHeader.sortDir });
  }

  // Thay đổi số trang phân trang
  onQueryParamsChange(tableQueryParams: NzTableQueryParams): void {
    this.changePageIndex.emit(tableQueryParams);
  }

  // Chỉnh sửa số trang cho mỗi trang vài mục
  onPageSizeChange($event: NzSafeAny): void {
    this.changePageSize.emit($event);
  }

  changecashExpandIdArray(id: number | string, expand: boolean): void {
    const index = this.cashExpandIdArray.indexOf(id);
    if (expand) {
      if (index === -1) {
        this.cashExpandIdArray.push(id);
      }
    } else {
      if (index !== -1) {
        this.cashExpandIdArray.splice(index, 1);
      }
    }
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    this.changecashExpandIdArray(data.id, $event);
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  // Cài đặt chọn hoặc không chọn, và xử lý giá trị bộ nhớ đệm
  setIsCheckFn(dataItem: NzSafeAny, isChecked: boolean): void {
    dataItem['_checked'] = isChecked;
    const index = this.checkedCashArrayFromComment.findIndex(cashItem => cashItem.id === dataItem.id);
    if (isChecked) {
      if (index === -1) {
        this.checkedCashArrayFromComment.push(dataItem);
      }
    } else {
      if (index !== -1) {
        this.checkedCashArrayFromComment.splice(index, 1);
      }
    }
  }

  // Chọn tất cả
  onAllChecked(isChecked: boolean): void {
    fnGetFlattenTreeDataByMap(this.mapOfExpandedData).forEach(row => {
      this.setIsCheckFn(row, isChecked);
    });
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // Chọn đơn
  public checkRowSingle(isChecked: boolean, selectIndex: number, row: TreeNodeInterface): void {
    this.setIsCheckFn(row, isChecked);
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // Làm mới trạng thái hộp kiểm
  refreshStatus(): void {
    // lấy được trải phẳngtreeData
    const dataTempArray: TreeNodeInterface[] = fnGetFlattenTreeDataByMap(this.mapOfExpandedData);

    const allChecked =
      dataTempArray.length > 0 &&
      dataTempArray.every(item => {
        return item['_checked'] === true;
      });
    const allUnChecked = dataTempArray.length > 0 && dataTempArray.every(item => item['_checked'] !== true);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cashArray'] && !changes['cashArray'].firstChange) {
      this.checkedCashArrayFromComment = [...changes['cashArray'].currentValue];
      fnGetFlattenTreeDataByMap(this.mapOfExpandedData).forEach(row => {
        // Kiểm tra xem có giá trị này trong bộ nhớ đệm hay không, nếu có thì đặt thànhtrue
        const index = this.checkedCashArrayFromComment.findIndex(item => item.id === row.id);
        this.setIsCheckFn(row, index !== -1);
      });
      this.refreshStatus();
    }
  }
}
