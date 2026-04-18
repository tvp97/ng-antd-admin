import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AntTableConfig, SortFile, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';

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
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
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
    AntTableComponent,
    NzBadgeModule,
    CardTableWrapComponent
  ]
})
export class SearchTableComponent implements OnInit {
  searchParam: Partial<SearchParam> = {};
  readonly highLightTpl = viewChild.required<TemplateRef<NzSafeAny>>('highLightTpl');
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  isCollapse = true;
  tableConfig = signal<AntTableConfig>({ headers: [], total: 0, showCheckbox: true, loading: false, pageSize: 10, pageIndex: 1 });
  readonly pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Bảng tra cứu (có thể kéo tiêu đề, nhấp vào danh sách"Xem"Nút, trình diễn ở hiện tạitabmởChi tiếtVận hành, nếu cần mở mớitabtrưng bàyChi tiếtVui lòng chuyển đến"chức năng>Thao tác tab"xem hiệu quả trình diễn ở giữa',
    // desc: 'Trang biểu mẫu được dùng để thu thập hoặc xác minh thông tin từ người dùng, các biểu mẫu cơ bản thường xuất hiện trong các tình huống biểu mẫu có ít mục dữ liệu.',
    breadcrumb: ['Trang chủ', 'Trang danh sách', 'Bảng tra cứu']
  };
  checkedCashArray: NzSafeAny[] = [
    {
      id: '1',
      noShow: 'Mặc định không hiển thị',
      longText: 'Văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài',
      newline: 'Không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng',
      addStyle: 'Thêm kiểu',
      name: 'Mẫu tùy chỉnh',
      obj: { a: { b: 'Giá trị được chọn1' } }
    },
    {
      id: '2',
      noShow: 'Mặc định không hiển thị',
      longText: 'Văn bản siêu dài',
      newline: 'string',
      name: 'Mẫu tùy chỉnh',
      addStyle: 'Thêm kiểu',
      obj: { a: { b: 'Giá trị được chọn1' } }
    }
  ]; // Cần chỉnh sửa thành loại dữ liệu tương ứng của nghiệp vụ
  dataList = signal<NzSafeAny[]>([]); // Cần chỉnh sửa thành loại dữ liệu tương ứng của nghiệp vụ

  private modalSrv = inject(NzModalService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  // Kích hoạt khi chọn hộp kiểm bên trái cùng
  selectedChecked(e: NzSafeAny): void {
    this.checkedCashArray = [...e];
  }

  // Tải lại trang
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
          id: '1',
          noShow: 'Mặc định không hiển thị',
          longText: 'Văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài',
          newline: 'Không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng',
          addStyle: 'Thêm kiểu',
          name: 'Mẫu tùy chỉnh',
          obj: { a: { b: 'Giá trị được chọn1' } }
        },
        {
          id: '2',
          noShow: 'Mặc định không hiển thị',
          longText: 'Văn bản siêu dài',
          newline: 'string',
          name: 'Mẫu tùy chỉnh',
          addStyle: 'Thêm kiểu',
          obj: { a: { b: 'Giá trị được chọn1' } }
        },
        {
          id: '3',
          noShow: 'Mặc định không hiển thị',
          longText: 'string',
          newline: 'string',
          name: 'Mẫu tùy chỉnh',
          addStyle: 'Thêm kiểu',
          obj: { a: { b: 'Giá trị được chọn1' } }
        },
        {
          id: '4',
          noShow: 'Mặc định không hiển thị',
          longText: 'string',
          newline: 'string',
          name: 'Mẫu tùy chỉnh',
          addStyle: 'Thêm kiểu',
          obj: { a: { b: 'Giá trị được chọn1' } }
        },
        {
          id: '5',
          noShow: 'Mặc định không hiển thị',
          longText: 'string',
          newline: 'string',
          name: 'Mẫu tùy chỉnh',
          addStyle: 'Thêm kiểu',
          obj: { a: { b: 'Giá trị được chọn1' } }
        },
        {
          id: '6',
          noShow: 'Mặc định không hiển thị',
          longText: 'string',
          newline: 'string',
          name: 'Mẫu tùy chỉnh',
          addStyle: 'Thêm kiểu',
          obj: { a: { b: 'Giá trị được chọn1' } }
        }
      ]);
      this.tableConfig.update(c => ({ ...c, total: 13, pageIndex: 1 }));
      this.checkedCashArray = [...this.checkedCashArray];
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

  /*Đặt lại*/
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  /*Mở rộng*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  /*Xem*/
  check(name: string): void {
    // skipLocationChangeĐặt khi điều hướng không ghi trạng thái mới vào lịch sử làtrue
    this.router.navigate(['default/page-demo/list/search-table/search-table-detail', name, 123]);
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

  del(id: number): void {
    this.modalSrv.confirm({
      nzTitle: 'Xác nhậnMuốnXóaÀ?',
      nzContent: 'Xóakhông thể khôi phục sau này',
      nzOnOk: () => {
        this.tableLoading(true);
        /*Chú thích là gọi giao diện mô phỏng*/
        // this.dataService.delFireSys([id]).subscribe(() => {
        //   if (this.dataList.length === 1) {
        //     this.tableConfig.pageIndex--;
        //   }
        //   this.getDataList();
        //   this.checkedCashArray.splice(this.checkedCashArray.findIndex(item => item.id === id), 1);
        // }, error => this.tableLoading(false));

        setTimeout(() => {
          this.message.info(`idMảng(Hỗ trợ phân trangLưu):${JSON.stringify(id)}`);
          this.getDataList();
          this.checkedCashArray.splice(
            this.checkedCashArray.findIndex(item => item.id === id),
            1
          );
          this.tableLoading(false);
        }, 3000);
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
          // Ghi chú là việc gọi giao diện mô phỏng
          // this.dataService.delFireSys(tempArrays).subscribe(() => {
          //   if (this.dataList.length === 1) {
          //     this.tableConfig.pageIndex--;
          //   }
          //   this.getDataList();
          //   this.checkedCashArray = [];
          // }, error => this.tableLoading(false));
          setTimeout(() => {
            this.message.info(`idMảng(Hỗ trợ phân trangLưu):${JSON.stringify(tempArrays)}`);
            this.getDataList();
            this.checkedCashArray = [];
            this.tableLoading(false);
          }, 1000);
        }
      });
    } else {
      this.message.error('Vui lòng đánh dấu dữ liệu');
      return;
    }
  }

  changeSort(e: SortFile): void {
    this.message.info(`Trường sắp xếp:${e.fileName},Xếp hạng là:${e.sortDir}`);
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
          title: 'Mặc định không hiển thị',
          width: 130,
          field: 'noShow',
          show: false
        },
        {
          title: 'Chữ dài',
          width: 130,
          field: 'longText',
          showSort: true
        },
        {
          title: 'xuống dòng',
          width: 100,
          field: 'newline',
          notNeedEllipsis: true,
          showSort: true,
          tdClassList: ['text-wrap']
        },
        {
          title: 'Thêm kiểu',
          width: 100,
          field: 'addStyle',
          tdClassList: ['operate-text']
        },
        {
          title: 'Mẫu tùy chỉnh',
          field: 'name',
          tdTemplate: this.highLightTpl(),
          width: 140
        },
        {
          title: 'Nhấn vào đối tượng (obj.a.b）',
          field: 'obj.a.b'
        },
        {
          title: 'vận hành',
          tdTemplate: this.operationTpl(),
          width: 120,
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
