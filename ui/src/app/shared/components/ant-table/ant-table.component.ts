import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, input, InputSignal, OnChanges, output, SimpleChanges, TemplateRef } from '@angular/core';

import { ContextPipePipe } from '@shared/components/ant-table/context-pipe.pipe';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzResizableModule, NzResizeEvent } from 'ng-zorro-antd/resizable';
import { NzTableModule, NzTableQueryParams, NzTableSize } from 'ng-zorro-antd/table';

import { MapPipe } from '../../pipes/map.pipe';
import { TableFiledPipe } from '../../pipes/table-filed.pipe';

export interface TableHeader {
  title: string; // Tên tiêu đề
  field?: string; // Trường
  pipe?: string; // Ống dẫn
  showSort?: boolean; // Có hiển thị sắp xếp không
  sortDir?: undefined | 'asc' | 'desc'; // Hướng sắp xếp
  width?: number; // Chiều rộng ô
  thTemplate?: TemplateRef<NzSafeAny>; // thMẫu ô
  tdTemplate?: TemplateRef<NzSafeAny>; // tdMẫu ô
  fixed?: boolean; // Có cố định ô không （Chỉ hiệu quả khi cố định liên tục từ bên trái nhất hoặc bên phải nhất）
  fixedDir?: 'left' | 'right'; // Cố định ở bên trái hay bên phải, cần phối hợpfixedHãy sử dụng
  notNeedEllipsis?: boolean; // Không cần...khi chotrue
  tdClassList?: string[]; // vìtdLớp chỉ định ô (Lớp trong thành phần cha phải được thêm vào /deep/ Chỉ có tiền tố mới có hiệu lực đối với các thành phần con)
  thClassList?: string[]; // vìthLớp chỉ định ô  (Lớp trong thành phần cha phải được thêm vào /deep/ Chỉ có tiền tố mới có hiệu lực đối với các thành phần con)
  show?: boolean; // Có hiển thị cột không,false:Không hiển thị, khác: hiển thị
  tdClassFn?: (data: NzSafeAny, index: number) => string[];
  thClassFn?: (data: NzSafeAny) => string[];
}

export interface AntTableConfig {
  needNoScroll?: boolean; //Danh sách có cần thanh cuộn không
  xScroll?: number; //Thanh cuộn ngang của danh sách
  yScroll?: number; //Thanh cuộn dọc của danh sách
  virtualItemSize?: number; //Chiều cao của mỗi cột khi cuộn ảo, với cdk itemSize tương tự
  showCheckbox?: boolean; // Nếu cầncheckBox,thì cầnshowCheckbox=true,và sử dụngapp-ant-tabletruyền vào khi lắp ráp thành phần [checkedCashArrayFromComment]="cashArray"，cashArrayĐối với mảng do chính mình định nghĩa trong thành phần nghiệp vụ, và cầntabletrongdatađều có mộtidThuộc tính
  pageIndex: number; // Số trang hiện tại (liên kết hai chiều với số trang trong trang)
  pageSize: number; // Số lượng mục dữ liệu hiển thị trên mỗi trang (với trong trangpageSizeRàng buộc hai chiều
  total: number; // Tổng lượng dữ liệu, dùng để tính phân trang (nên lấy từ giao diện lập trình phía sau)
  loading: boolean; // Có hiển thị bảng không Đang tải
  headers: TableHeader[]; // Cài đặt cột
}

export abstract class AntTableComponentToken {
  tableSize!: NzTableSize;
  tableConfig!: InputSignal<AntTableConfig>;

  abstract tableChangeDectction(): void;
}

export interface SortFile {
  fileName: string;
  sortDir: undefined | 'desc' | 'asc';
}

@Component({
  selector: 'app-ant-table',
  templateUrl: './ant-table.component.html',
  styleUrl: './ant-table.component.less',
  providers: [{ provide: AntTableComponentToken, useExisting: AntTableComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzTableModule, NzResizableModule, NgTemplateOutlet, MapPipe, TableFiledPipe, ContextPipePipe]
})
export class AntTableComponent implements OnChanges {
  // Đã được chọn trong bộ nhớ đệm truyền từ thành phần kinh doanhcheckboxmảng dữ liệu
  readonly checkedCashArrayFromComment = input<NzSafeAny[]>([]);

  tableData = input<NzSafeAny[]>([]);
  _dataList = computed(() => {
    if (this.tableConfig().showCheckbox) {
      return this.tableData().map(item => {
        return { ...item, _checked: false };
      });
    }
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

  tableConfig = input.required<AntTableConfig>();

  _scrollConfig = computed(() => {
    return this.setScrollConfig(this.tableConfig());
  });

  readonly changePageIndex = output<NzTableQueryParams>();
  readonly changePageSize = output<number>();
  readonly selectedChange = output<NzSafeAny[]>();
  readonly sortFn = output<SortFile>();
  indeterminate = false;
  allChecked = false;
  private cdr = inject(ChangeDetectorRef);

  setScrollConfig(value: AntTableConfig): { x: string; y: string } | {} {
    if (!value || value.needNoScroll) {
      return {};
    }
    const scrollConfig: { x?: string; y?: string } = { x: '100px' };
    if (value.xScroll !== undefined) {
      scrollConfig.x = `${value.xScroll}px`;
    }
    if (value.yScroll !== undefined) {
      scrollConfig.y = `${value.yScroll}px`;
    }
    return scrollConfig;
  }

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

  tableChangeDectction(): void {
    // Thay đổi tham chiếu sẽ kích hoạt kiểm tra thay đổi.
    // this._dataList() = [...this._dataList()];
    this.cdr.markForCheck();
  }

  trackById(_: number, data: { id: number }): number {
    return data.id;
  }

  public trackByTableHead(index: number, item: NzSafeAny): string {
    return `${item.title}-${index}`;
  }

  public trackByTableBody(index: number, item: NzSafeAny): string {
    return `${item.id}-${index}`;
  }

  // Thay đổi số trang phân trang
  onQueryParamsChange(tableQueryParams: NzTableQueryParams): void {
    this.changePageIndex.emit(tableQueryParams);
  }

  // Chỉnh sửa số trang cho mỗi trang vài mục
  onPageSizeChange($event: NzSafeAny): void {
    this.changePageSize.emit($event);
  }

  onResize({ width }: NzResizeEvent, col: string): void {
    this.tableConfig().headers = this.tableConfig().headers.map(e =>
      e.title === col
        ? {
            ...e,
            width: +`${width}`
          }
        : e
    ) as TableHeader[];
  }

  checkFn(dataItem: NzSafeAny, isChecked: boolean): void {
    dataItem['_checked'] = isChecked;
    const index = this.checkedCashArrayFromComment().findIndex(cashItem => cashItem.id === dataItem.id);
    if (isChecked) {
      if (index === -1) {
        this.checkedCashArrayFromComment().push(dataItem);
      }
    } else {
      if (index !== -1) {
        this.checkedCashArrayFromComment().splice(index, 1);
      }
    }
  }

  // Chọn đơn
  public checkRowSingle(isChecked: boolean, selectIndex: number): void {
    this.checkFn(this._dataList()[selectIndex], isChecked);
    this.selectedChange.emit(this.checkedCashArrayFromComment());
    this.refreshStatus();
  }

  // Chọn tất cả
  onAllChecked(isChecked: boolean): void {
    this._dataList().forEach(item => {
      this.checkFn(item, isChecked);
    });
    this.selectedChange.emit(this.checkedCashArrayFromComment());
    this.refreshStatus();
  }

  // Làm mới trạng thái hộp kiểm
  refreshStatus(): void {
    this._dataList().forEach(item => {
      const index = this.checkedCashArrayFromComment().findIndex(cashItem => {
        return item.id === cashItem.id;
      });
      item['_checked'] = index !== -1;
    });
    const allChecked =
      this._dataList().length > 0 &&
      this._dataList().every(item => {
        return item['_checked'] === true;
      });
    const allUnChecked = this._dataList().every(item => item['_checked'] !== true);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkedCashArrayFromComment']) {
      this.refreshStatus();
    }
  }
}
