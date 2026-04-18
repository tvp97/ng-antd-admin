import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, inject, DestroyRef, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { OptionsInterface, SearchCommonVO } from '@core/services/types';
import { Dept, DeptService } from '@services/system/dept.service';
import { AntTableConfig, SortFile } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TreeNodeInterface, TreeTableComponent } from '@shared/components/tree-table/tree-table.component';
import { AuthDirective } from '@shared/directives/auth.directive';
import { MapKeyType, MapPipe, MapSet } from '@shared/pipes/map.pipe';
import { fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList, fnSortTreeData } from '@utils/treeTableTools';
import { ModalBtnStatus } from '@widget/base-modal';
import { DeptManageModalService } from '@widget/biz-widget/system/dept-manage-modal/dept-manage-modal.service';

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
import { NzTagModule } from 'ng-zorro-antd/tag';

interface SearchParam {
  departmentName: string;
  state: boolean;
}

@Component({
  selector: 'app-dept',
  templateUrl: './dept.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    TreeTableComponent,
    NgTemplateOutlet,
    NzTagModule,
    AuthDirective
  ]
})
export class DeptComponent implements OnInit {
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  readonly state = viewChild.required<TemplateRef<NzSafeAny>>('state');
  ActionCode = ActionCode;
  searchParam: Partial<SearchParam> = {};
  destroyRef = inject(DestroyRef);
  readonly pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Quản lý bộ phận',
    breadcrumb: ['Trang chủ', 'Quản lý hệ thống', 'Quản lý bộ phận']
  };
  dataList = signal<TreeNodeInterface[]>([]);
  readonly stateOptions: OptionsInterface[] = [...MapPipe.transformMapToArray(MapSet.available, MapKeyType.Boolean)];

  private deptModalService = inject(DeptManageModalService);
  private dataService = inject(DeptService);
  private modalSrv = inject(NzModalService);
  private message = inject(NzMessageService);

  tableConfig = signal<AntTableConfig>({
    headers: [],
    total: 0,
    showCheckbox: false,
    loading: false,
    pageSize: 10,
    pageIndex: 1
  });

  reloadTable(): void {
    this.message.info('Đã làm mới');
    this.getDataList();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.update(config => ({ ...config, loading: isLoading }));
  }

  getDataList(sortFile?: SortFile): void {
    this.tableLoading(true);
    const params: SearchCommonVO<NzSafeAny> = {
      pageSize: 0,
      pageIndex: 0,
      filters: this.searchParam
    };
    this.dataService
      .getDepts(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(deptList => {
        const target = fnFlatDataHasParentToTree(deptList.list);
        let list = fnFlattenTreeDataByDataList(target);
        // Bởi vì phần trước phải đối với phần sauQuay lạiDữ liệu được xử lý, vì vậy việc sắp xếp ở đây được giao cho phần front-end thực hiện
        if (sortFile) {
          fnSortTreeData(list, sortFile);
        }
        this.dataList.set(list);
        this.tableLoading(false);
      });
  }

  /*Xem*/
  check(id: string, children: NzSafeAny[], parent: NzSafeAny[]): void {
    this.message.success(id);
  }

  /*Đặt lại*/
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(fatherId: number): void {
    this.deptModalService
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
        param.fatherId = fatherId;
        this.tableLoading(true);
        this.addEditData(param, 'addDepts');
      });
  }

  addEditData(param: Dept, methodName: 'editDepts' | 'addDepts'): void {
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

  del(id: number): void {
    const ids: number[] = [id];
    this.modalSrv.confirm({
      nzTitle: 'Xác nhậnMuốnXóaÀ?',
      nzContent: 'Xóakhông thể khôi phục sau này',
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService
          .delDepts(ids)
          .pipe(
            finalize(() => {
              this.tableLoading(false);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(() => {
            // Ví dụ, trang thứ hai của phân trang chỉ có một mục dữ liệu, lúc nàyXóaDữ liệu này, chuyển sang trang đầu tiên và truy vấn lại danh sách,pageIndexThay đổi sẽ được bởichangePageIndexTự động kích hoạt truy vấn biểu mẫugetDataList（）
            if (this.dataList().length === 1 && this.tableConfig().pageIndex !== 1) {
              this.tableConfig.update(config => ({ ...config, pageIndex: config.pageIndex! - 1 }));
            } else {
              this.getDataList();
            }
          });
      }
    });
  }

  // Chỉnh sửa
  edit(id: number, fatherId: number): void {
    this.dataService
      .getDeptsDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.deptModalService
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
            modalValue.fatherId = fatherId;
            this.tableLoading(true);
            this.addEditData(modalValue, 'editDepts');
          });
      });
  }

  changeSort(e: SortFile): void {
    this.getDataList(e);
  }

  // Sửa một trang vài mục
  changePageSize(e: number): void {
    this.tableConfig.update(config => ({ ...config, pageSize: e }));
  }

  private initTable(): void {
    this.tableConfig.set({
      headers: [
        {
          title: 'Tên bộ phận',
          width: 230,
          field: 'departmentName'
        },
        {
          title: 'Trạng thái bộ phận',
          field: 'state',
          tdTemplate: this.state(),
          width: 100
        },
        {
          title: 'Sắp xếp',
          field: 'orderNum',
          showSort: true,
          width: 100
        },
        {
          title: 'Thời gian tạo',
          field: 'createdAt',
          pipe: 'date:yyyy-MM-dd HH:mm',
          width: 180
        },
        {
          title: 'vận hành',
          tdTemplate: this.operationTpl(),
          width: 180,
          fixed: false,
          fixedDir: 'right'
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    });
  }

  ngOnInit(): void {
    this.initTable();
  }
}
