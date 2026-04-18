import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AntTableConfig, SortFile } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TreeTableComponent } from '@shared/components/tree-table/tree-table.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { fnFlattenTreeDataByDataList } from '@utils/treeTableTools';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface SearchParam {
  ruleName: number;
  desc: string;
}

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzCardModule,

    FormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    TreeTableComponent,
    NzBadgeModule
  ]
})
export class TreeListComponent implements OnInit {
  readonly highLightTpl = viewChild.required<TemplateRef<NzSafeAny>>('highLightTpl');
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  searchParam: Partial<SearchParam> = {};

  isCollapse = true;
  tableConfig = signal<AntTableConfig>({ headers: [], total: 0, showCheckbox: false, loading: false, pageSize: 10, pageIndex: 1 });
  readonly pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Bảng dạng cây (trình bày tình huống giá trị mặc định,XóaHoặc kiểm tra, có thể in các dòng đã chọnid）',
    // desc: 'Trang biểu mẫu được dùng để thu thập hoặc xác minh thông tin từ người dùng, các biểu mẫu cơ bản thường xuất hiện trong các tình huống biểu mẫu có ít mục dữ liệu.',
    breadcrumb: ['Trang chủ', 'Trang danh sách', 'Bảng dạng cây']
  };
  checkedCashArray: NzSafeAny[] = [];
  dataList = signal<NzSafeAny[]>([]);

  private modalSrv = inject(NzModalService);
  private message = inject(NzMessageService);

  reloadTable(): void {
    this.message.info('Đã làm mới');
    this.getDataList();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.update(config => ({ ...config, loading: isLoading }));
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableLoading(true);
    this.dataList.set([]);
    setTimeout(() => {
      this.dataList.set([
        {
          id: `1`,
          name: 'John Brown sr.',
          sex: 'Nam',
          age: 60,
          address: 'New York No. 1 Lake Park',
          children: [
            {
              id: `1-1`,
              name: 'John Brown',
              age: 42,
              sex: 'Nam',
              address: 'New York No. 2 Lake Park'
            },
            {
              id: `1-2`,
              name: 'John Brown jr.',
              age: 30,
              sex: 'Nam',
              address: 'New York No. 3 Lake Park',
              children: [
                {
                  id: `1-2-1`,
                  name: 'Jimmy Brown',
                  sex: 'Nam',
                  age: 16,
                  address: 'New York No. 3 Lake Park'
                }
              ]
            },
            {
              id: `1-3`,
              name: 'Jim Green sr.',
              age: 72,
              sex: 'Nam',
              address: 'London No. 1 Lake Park',
              children: [
                {
                  id: `1-3-1`,
                  name: 'Jim Green',
                  sex: 'Nam',
                  age: 42,
                  address: 'London No. 2 Lake Park',
                  children: [
                    {
                      id: `1-3-1-1`,
                      name: 'Jim Green jr.',
                      sex: 'Nam',
                      age: 25,
                      address: 'London No. 3 Lake Park'
                    },
                    {
                      id: `1-3-1-2`,
                      name: 'Jimmy Green sr.',
                      sex: 'Nam',
                      age: 18,
                      address: 'London No. 4 Lake Park'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: `2`,
          name: 'Joe Black',
          sex: 'Nam',
          age: 32,
          address: 'Sidney No. 1 Lake Park'
        }
      ]);
      this.tableConfig.update(c => ({ ...c, total: 13, pageIndex: 1 }));
      const cashFromHttp = [
        {
          id: `1`,
          name: 'John Brown sr.',
          sex: 'Nam',
          age: 60,
          address: 'New York No. 1 Lake Park',
          children: [
            {
              id: `1-2`,
              name: 'John Brown jr.',
              age: 30,
              sex: 'Nam',
              address: 'New York No. 3 Lake Park',
              children: [
                {
                  id: `1-2-1`,
                  name: 'Jimmy Brown',
                  sex: 'Nam',
                  age: 16,
                  address: 'New York No. 3 Lake Park'
                }
              ]
            },
            {
              id: `1-3`,
              name: 'Jim Green sr.',
              age: 72,
              sex: 'Nam',
              address: 'London No. 1 Lake Park',
              children: [
                {
                  id: `1-3-1`,
                  name: 'Jim Green',
                  sex: 'Nam',
                  age: 42,
                  address: 'London No. 2 Lake Park',
                  children: [
                    {
                      id: `1-3-1-1`,
                      name: 'Jim Green jr.',
                      sex: 'Nam',
                      age: 25,
                      address: 'London No. 3 Lake Park'
                    },
                    {
                      id: `1-3-1-2`,
                      name: 'Jimmy Green sr.',
                      sex: 'Nam',
                      age: 18,
                      address: 'London No. 4 Lake Park'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
      this.checkedCashArray = fnFlattenTreeDataByDataList(cashFromHttp);
      // this.checkedCashArray = [...this.checkedCashArray];
      this.tableLoading(false);
    });

    /*-----Yêu cầu kinh doanh thực tếhttpGiao diện như sau------*/
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<NzSafeAny> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageIndex: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.dataService.getFireSysList(params).pipe(finalize(() => {
    //   this.tableLoading(false);
    // })).subscribe((data => {
    //   const {list, total, pageIndex} = data;
    //   this.dataList = [...list];
    //   this.tableConfig.total = total!;
    //   this.tableConfig.pageIndex = pageIndex!;
    //   this.tableLoading(false);
    //   this.checkedCashArray = [...this.checkedCashArray];
    // }));
  }

  /*Mở rộng*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  /*Xem*/
  check(id: string, children: NzSafeAny[], parent: NzSafeAny[]): void {
    this.message.success(id);
    console.log(children);
    console.log(parent);
  }

  /*Đặt lại*/
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(): void {
    // this.modalService.show({nzTitle: 'Thêm mới'}).subscribe((res) => {
    //   if (!res || res.status === ModalBtnStatus.Cancel) {
    //     return;
    //   }
    //   this.tableLoading(true);
    //   this.addEditData(res.modalValue, 'addFireSys');
    // }, error => this.tableLoading(false));
  }

  del(id: number): void {
    this.modalSrv.confirm({
      nzTitle: 'Xác nhậnMuốnXóaÀ?',
      nzContent: 'Xóakhông thể khôi phục sau này',
      nzOnOk: () => {
        this.tableLoading(true);
        this.message.info(`idMảng(Hỗ trợ phân trangLưu):${JSON.stringify(id)}`);
        this.getDataList();
        this.checkedCashArray.splice(
          this.checkedCashArray.findIndex(item => item.id === id),
          1
        );
        this.tableLoading(false);
        /*Chú thích là gọi giao diện mô phỏng*/
        // this.dataService.delFireSys([id]).subscribe(() => {
        //   if (this.dataList.length === 1) {
        //     this.tableConfig.pageIndex--;
        //   }
        //   this.getDataList();
        //   this.checkedCashArray.splice(this.checkedCashArray.findIndex(item => item.id === id), 1);
        // }, error => this.tableLoading(false));
      }
    });
  }

  allDel(): void {
    if (this.checkedCashArray.length > 0) {
      this.modalSrv.confirm({
        nzTitle: 'Xác nhậnMuốnXóaÀ?',
        nzContent: 'Xóakhông thể khôi phục sau này',
        nzOnOk: () => {
          const tempArrays: number[] = [];
          this.checkedCashArray.forEach(item => {
            tempArrays.push(item.id);
          });
          this.tableLoading(true);
          this.message.info(`Mảng(Hỗ trợ phân trangLưu):${JSON.stringify(tempArrays)}`);
          this.getDataList();
          this.checkedCashArray = [];
          this.tableLoading(false);
          // Ghi chú là việc gọi giao diện mô phỏng
          // this.dataService.delFireSys(tempArrays).subscribe(() => {
          //   if (this.dataList.length === 1) {
          //     this.tableConfig.pageIndex--;
          //   }
          //   this.getDataList();
          //   this.checkedCashArray = [];
          // }, error => this.tableLoading(false));
        }
      });
    } else {
      this.message.error('Vui lòng đánh dấu dữ liệu');
      return;
    }
  }

  // Chỉnh sửa
  edit(id: number): void {
    // this.dataService.getFireSysDetail(id).subscribe(res => {
    //   this.modalService.show({nzTitle: 'Sửa'}, res).subscribe(({modalValue, status}) => {
    //     if (status === ModalBtnStatus.Cancel) {
    //       return;
    //     }
    //     modalValue.id = id;
    //     this.tableLoading(true);
    //     this.addEditData(modalValue, 'editFireSys');
    //   }, error => this.tableLoading(false));
    // });
  }

  // addEditData(param: FireSysObj, methodName: 'editFireSys' | 'addFireSys'): void {
  //   this.dataService[methodName](param).subscribe(() => {
  //     this.getDataList();
  //   });
  // }

  changeSort(e: SortFile): void {
    this.message.info(`Trường sắp xếp:${e.fileName},Xếp hạng là:${e.sortDir}`);
  }

  // Kích hoạt khi chọn hộp kiểm bên trái cùng
  selectedChecked(e: NzSafeAny): void {
    this.checkedCashArray = [...e];
    console.log(this.checkedCashArray);
  }

  // Sửa một trang vài mục
  changePageSize(e: number): void {
    this.tableConfig.update(c => ({ ...c, pageSize: e }));
  }

  private initTable(): void {
    /*
     * Chú ý, ở đây cần để trống một cột, không được thiết lậpwidth, cho danh sách tự điều chỉnh chiều rộng
     *
     * */
    this.tableConfig.set({
      headers: [
        {
          title: 'Họ và tên',
          width: 230,
          field: 'name',
          showSort: true,
          tdClassList: ['operate-text']
        },
        {
          title: 'Giới tính',
          field: 'sex',
          width: 230,
          tdTemplate: this.highLightTpl()
        },
        {
          title: 'Tuổi',
          field: 'age',
          width: 230,
          showSort: true
        },
        {
          title: 'Địa chỉ',
          field: 'address'
        },
        {
          title: 'vận hành',
          tdTemplate: this.operationTpl(),
          width: 130,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      showCheckbox: true,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    });
  }

  ngOnInit(): void {
    this.initTable();
  }
}
