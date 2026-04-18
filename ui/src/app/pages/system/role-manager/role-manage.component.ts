import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { SearchCommonVO } from '@core/services/types';
import { Role, RoleService } from '@services/system/role.service';
import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AuthDirective } from '@shared/directives/auth.directive';
import { ModalBtnStatus } from '@widget/base-modal';
import { RoleManageModalService } from '@widget/biz-widget/system/role-manage-modal/role-manage-modal.service';

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

interface SearchParam {
  roleName: string;
}

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.component.html',
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
    AuthDirective
  ]
})
export class RoleManageComponent implements OnInit {
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  searchParam: Partial<SearchParam> = {};
  tableConfig = signal<AntTableConfig>({ headers: [], total: 0, showCheckbox: false, loading: false, pageSize: 10, pageIndex: 1 });
  readonly pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Quản lý vai trò',
    breadcrumb: ['Trang chủ', 'Quản lý người dùng', 'Quản lý vai trò']
  };
  dataList = signal<Role[]>([]);
  checkedCashArray = [];
  ActionCode = ActionCode;
  destroyRef = inject(DestroyRef);

  private dataService = inject(RoleService);
  private modalSrv = inject(NzModalService);
  private modalService = inject(RoleManageModalService);
  private router = inject(Router);
  private message = inject(NzMessageService);

  selectedChecked(e: NzSafeAny): void {
    // @ts-ignore
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
      .getRoles(params)
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
  setRole(id: number, roleName: string): void {
    this.router.navigate(['/default/system/role-manager/set-role'], { queryParams: { id, roleName } });
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
        const param = { ...res.modalValue };
        this.tableLoading(true);
        this.addEditData(param, 'addRoles');
      });
  }

  reloadTable(): void {
    this.message.info('Làm mới thành công');
    this.getDataList();
  }

  // Ở đây làm một ví dụ, để lấy dữ liệu của cột được chọn, mà không thông qua giao diện, ở đây có thể thông quadataItemLấy dữ liệu của cột hiện tại, cũng có thể thông quaidtừdataListtìm dữ liệu phù hợp trong đó
  // Đề xuất sử dụng giao diện để lấyChi tiếtcách thức này, vì điều này đảm bảo tính thời gian thực của dữ liệu
  // Chỉnh sửa
  edit(id: number, dataItem: Role): void {
    this.dataService
      .getRolesDetail(id)
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
            this.addEditData(modalValue, 'editRoles');
          });
      });
  }

  addEditData(param: Role, methodName: 'editRoles' | 'addRoles'): void {
    this.dataService[methodName](param)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getDataList();
      });
  }

  del(id: number): void {
    const ids: number[] = [id];
    this.modalSrv.confirm({
      nzTitle: 'Xác nhậnMuốnXóaÀ?',
      nzContent: 'Xóakhông thể khôi phục sau này',
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService
          .delRoles(ids)
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

  changePageSize(e: number): void {
    this.tableConfig.update(config => ({ ...config, pageSize: e }));
  }

  ngOnInit(): void {
    this.initTable();
  }

  private initTable(): void {
    this.tableConfig.set({
      showCheckbox: false,
      headers: [
        {
          title: 'Tên vai trò xưng',
          field: 'roleName',
          width: 100
        },
        {
          title: 'Ghi chú',
          width: 100,
          field: 'roleDesc'
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
