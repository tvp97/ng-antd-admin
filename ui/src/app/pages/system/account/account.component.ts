import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, inject, DestroyRef, viewChild, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { OptionsInterface, SearchCommonVO } from '@core/services/types';
import { AccountService, User } from '@services/system/account.service';
import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AuthDirective } from '@shared/directives/auth.directive';
import { MapKeyType, MapPipe, MapSet } from '@shared/pipes/map.pipe';
import { ModalBtnStatus } from '@widget/base-modal';
import { AccountModalService } from '@widget/biz-widget/system/account-modal/account-modal.service';

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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

interface SearchParam {
  userName: string;
  departmentId: number;
  mobile: number;
  available: boolean;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzGridModule,
    NzCardModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    AntTableComponent,
    NzSwitchModule,
    AuthDirective
  ]
})
export class AccountComponent implements OnInit {
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  readonly availableFlag = viewChild.required<TemplateRef<NzSafeAny>>('availableFlag');
  searchParam: Partial<SearchParam> = {};
  tableConfig = signal<AntTableConfig>({ headers: [], total: 0, showCheckbox: true, loading: false, pageSize: 10, pageIndex: 1 });
  readonly pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Quản lý tài khoản',
    breadcrumb: ['Trang chủ', 'Quản lý người dùng', 'Quản lý tài khoản'],
    desc: 'Đã loại bỏ bố cục của bộ phận bên trái, nếu cần có thể xemv20Mã mẫu và các phiên bản thấp hơn'
  };
  dataList = signal<User[]>([]);
  checkedCashArray: User[] = [];
  ActionCode = ActionCode;
  isCollapse = true;
  readonly availableOptions: OptionsInterface[] = [...MapPipe.transformMapToArray(MapSet.available, MapKeyType.Boolean)];
  destroyRef = inject(DestroyRef);

  private dataService = inject(AccountService);
  private modalSrv = inject(NzModalService);
  private modalService = inject(AccountModalService);
  private router = inject(Router);
  private message = inject(NzMessageService);

  selectedChecked(e: User[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.searchParam = {};
    this.getDataList({ pageIndex: 1 });
  }

  getDataList(e?: { pageIndex: number }): void {
    this.tableLoading(true);
    const params: SearchCommonVO<NzSafeAny> = {
      pageSize: this.tableConfig().pageSize!,
      pageIndex: e?.pageIndex || this.tableConfig().pageIndex!,
      filters: this.searchParam
    };
    this.dataService
      .getAccount(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => {
        const { list, total, pageIndex } = data;
        this.dataList.set([...list]);
        this.tableConfig.update(c => ({ ...c, total: total!, pageIndex: pageIndex! }));
        this.tableLoading(false);
        this.checkedCashArray = [...this.checkedCashArray];
      });
  }

  // Cài đặt quyền
  setRole(id: number): void {
    this.router.navigate(['/default/system/role-manager/set-role'], { queryParams: { id: id } });
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.update(config => ({ ...config, loading: isLoading }));
  }

  add(): void {
    this.modalService
      .show({ nzTitle: 'Thêm mới' })
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        this.tableLoading(true);
        this.addEditData(res.modalValue, 'addAccount');
      });
  }

  reloadTable(): void {
    this.message.info('Làm mới thành công');
    this.getDataList();
  }

  // Ở đây làm một ví dụ, để lấy dữ liệu của cột được chọn, mà không thông qua giao diện, ở đây có thể thông quadataItemLấy dữ liệu của cột hiện tại, cũng có thể thông quaidtừdataListtìm dữ liệu phù hợp trong đó
  // Đề xuất sử dụng giao diện để lấyChi tiếtcách thức này, vì điều này đảm bảo tính thời gian thực của dữ liệu
  // Chỉnh sửa
  edit(id: number, dataItem: User): void {
    console.log(dataItem);
    this.dataService
      .getAccountDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.modalService
          .show({ nzTitle: 'Sửa' }, res)
          .pipe(
            finalize(() => {
              this.tableLoading(false);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(({ modalValue, status }) => {
            if (status === ModalBtnStatus.Cancel) {
              return;
            }
            modalValue.id = id;
            this.tableLoading(true);
            this.addEditData(modalValue, 'editAccount');
          });
      });
  }

  addEditData(param: User, methodName: 'editAccount' | 'addAccount'): void {
    this.dataService[methodName](param)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.getDataList();
      });
  }

  changeStatus(e: boolean, id: number): void {
    this.tableLoading(true);
    const people: Partial<User> = {
      id,
      available: !e
    };
    this.dataService
      .editAccount(people as User)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.getDataList();
      });
  }

  allDel(): void {
    if (this.checkedCashArray.length > 0) {
      const tempArrays: number[] = [];
      this.modalSrv.confirm({
        nzTitle: 'Xác nhậnMuốnXóaÀ?',
        nzContent: 'Xóakhông thể khôi phục sau này',
        nzOnOk: () => {
          this.checkedCashArray.forEach(item => {
            tempArrays.push(item.id);
          });
          this.tableLoading(true);
          this.dataService
            .delAccount(tempArrays)
            .pipe(
              finalize(() => {
                this.tableLoading(false);
              }),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
              if (this.dataList().length === 1) {
                this.tableConfig.update(c => ({ ...c, pageIndex: c.pageIndex! - 1 }));
              }
              this.getDataList();
              this.checkedCashArray = [];
            });
        }
      });
    } else {
      this.message.error('Vui lòng đánh dấu dữ liệu');
      return;
    }
  }

  del(id: number): void {
    const ids: number[] = [id];
    this.modalSrv.confirm({
      nzTitle: 'Xác nhậnMuốnXóaÀ?',
      nzContent: 'Xóakhông thể khôi phục sau này',
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService
          .delAccount(ids)
          .pipe(
            finalize(() => {
              this.tableLoading(false);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(() => {
            // Ví dụ, trang thứ hai của phân trang chỉ có một mục dữ liệu, lúc nàyXóaDữ liệu này, chuyển sang trang đầu tiên và truy vấn lại danh sách,pageIndexThay đổi sẽ được bởichangePageIndexTự động kích hoạt truy vấn biểu mẫugetDataList（）
            if (this.dataList().length === 1 && this.tableConfig().pageIndex !== 1) {
              this.tableConfig.update(c => ({ ...c, pageIndex: c.pageIndex! - 1 }));
            } else {
              this.getDataList();
            }
          });
      }
    });
  }

  // Sửa một trang vài mục
  changePageSize(e: number): void {
    this.tableConfig.update(config => ({ ...config, pageSize: e }));
  }

  searchDeptIdUser(departmentId: number): void {
    this.searchParam.departmentId = departmentId;
    this.getDataList();
  }

  /*Mở rộng*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  ngOnInit(): void {
    this.initTable();
  }

  private initTable(): void {
    this.tableConfig.set({
      showCheckbox: true,
      headers: [
        {
          title: 'Tên đăng nhậpgọi',
          field: 'userName',
          width: 100
        },
        {
          title: 'Có sẵn không',
          width: 100,
          field: 'available',
          tdTemplate: this.availableFlag()
        },
        {
          title: 'Giới tính',
          width: 70,
          field: 'sex',
          pipe: 'sex'
        },
        {
          title: 'Điện thoại di động',
          width: 100,
          field: 'mobile'
        },
        {
          title: 'Hộp thư',
          width: 100,
          field: 'email'
        },
        {
          title: 'Lần đăng nhập cuối cùng',
          width: 120,
          field: 'lastLoginTime',
          pipe: 'date:yyyy-MM-dd HH:mm'
        },
        {
          title: 'Thời gian tạo',
          width: 100,
          field: 'createdAt',
          pipe: 'date:yyyy-MM-dd HH:mm'
        },
        {
          title: 'Điện thoại',
          width: 100,
          field: 'telephone'
        },
        {
          title: 'Bộ phận trực thuộc',
          width: 100,
          field: 'departmentName'
        },
        {
          title: 'vận hành',
          tdTemplate: this.operationTpl(),
          width: 150,
          fixed: true
        }
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    });
  }
}
