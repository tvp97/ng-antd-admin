import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, inject, DestroyRef, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { OptionsInterface, SearchCommonVO } from '@core/services/types';
import { MenuListObj, MenusService } from '@services/system/menus.service';
import { AntTableConfig, SortFile } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TreeNodeInterface, TreeTableComponent } from '@shared/components/tree-table/tree-table.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { AuthDirective } from '@shared/directives/auth.directive';
import { MapKeyType, MapPipe, MapSet } from '@shared/pipes/map.pipe';
import { fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList, fnSortTreeData } from '@utils/treeTableTools';
import { ModalBtnStatus } from '@widget/base-modal';
import { MenuModalService } from '@widget/biz-widget/system/menu-modal/menu-modal.service';

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
  menuName: number;
  visible: boolean;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
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
export class MenuComponent implements OnInit {
  readonly zorroIconTpl = viewChild.required<TemplateRef<NzSafeAny>>('zorroIconTpl');
  readonly aliIconTpl = viewChild.required<TemplateRef<NzSafeAny>>('aliIconTpl');
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  readonly visibleTpl = viewChild.required<TemplateRef<NzSafeAny>>('visibleTpl');
  readonly newLinkFlag = viewChild.required<TemplateRef<NzSafeAny>>('newLinkFlag');

  ActionCode = ActionCode;
  searchParam: Partial<SearchParam> = {};
  destroyRef = inject(DestroyRef);
  tableConfig = signal<AntTableConfig>({ headers: [], total: 0, showCheckbox: false, loading: false, pageSize: 10, pageIndex: 1 });
  readonly pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Quản lý thực đơn,Thêm mớiHoàn thành menu nhớ giao cho vai tương ứngThêmvừa mớiThêm mớiQuyền truy cập menu, nếu không sẽ không thể hiển thị',
    breadcrumb: ['Trang chủ', 'Quản lý hệ thống', 'Quản lý thực đơn']
  };
  dataList = signal<TreeNodeInterface[]>([]);
  readonly visibleOptions: OptionsInterface[] = [...MapPipe.transformMapToArray(MapSet.visible, MapKeyType.Boolean)];

  private menuModalService = inject(MenuModalService);
  private dataService = inject(MenusService);
  private modalSrv = inject(NzModalService);
  private message = inject(NzMessageService);

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
      .getMenuList(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(menuList => {
        const target = fnFlatDataHasParentToTree(menuList.list, 'fatherId');
        let list = fnFlattenTreeDataByDataList(target);
        console.log(sortFile);
        // Bởi vì phần trước phải đối với phần sauQuay lạiDữ liệu được xử lý, vì vậy việc sắp xếp ở đây được giao cho phần front-end thực hiện
        if (sortFile) {
          fnSortTreeData(list, sortFile);
        }
        this.dataList.set(list);
        this.tableLoading(false);
      });
  }

  /*Đặt lại*/
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(fatherId: number): void {
    this.menuModalService
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
        this.addEditData(param, 'addMenus');
      });
  }

  addEditData(param: MenuListObj, methodName: 'editMenus' | 'addMenus'): void {
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
    this.modalSrv.confirm({
      nzTitle: 'Xác nhậnMuốnXóaÀ?',
      nzContent: 'Xóakhông thể khôi phục sau này',
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService
          .delMenus(id)
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

  // Chỉnh sửa
  edit(id: number, fatherId: number): void {
    this.dataService
      .getMenuDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.menuModalService
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
            this.addEditData(modalValue, 'editMenus');
          });
      });
  }

  // Sửa một trang vài mục
  changePageSize(e: number): void {
    this.tableConfig.update(config => ({ ...config, pageSize: e }));
  }

  private initTable(): void {
    this.tableConfig.set({
      headers: [
        {
          title: 'Tên thực đơn',
          width: 230,
          field: 'menuName'
        },
        {
          title: 'zorroBiểu tượng',
          field: 'icon',
          width: 100,
          tdTemplate: this.zorroIconTpl()
        },
        {
          title: 'Biểu tượng Alibaba',
          field: 'alIcon',
          width: 100,
          tdTemplate: this.aliIconTpl()
        },
        {
          title: 'Mã quyền hạn',
          field: 'code',
          width: 300
        },
        {
          title: 'Địa chỉ định tuyến',
          field: 'path',
          width: 300
        },
        {
          title: 'Sắp xếp',
          field: 'orderNum',
          width: 80
        },
        {
          title: 'Trạng thái',
          field: 'status',
          pipe: 'available',
          width: 100
        },
        {
          title: 'trưng bày',
          field: 'visible',
          pipe: 'isOrNot',
          tdTemplate: this.visibleTpl(),
          width: 100
        },
        {
          title: 'Liên kết ngoài',
          field: 'newLinkFlag',
          pipe: 'isOrNot',
          tdTemplate: this.newLinkFlag(),
          width: 100
        },
        {
          title: 'Thời gian tạo',
          field: 'createdAt',
          pipe: 'date:yyyy-MM-dd HH:mm',
          width: 180
        },
        {
          title: 'Cập nhật thời gian',
          field: 'updatedAt',
          pipe: 'date:yyyy-MM-dd HH:mm',
          width: 180
        },
        {
          title: 'vận hành',
          tdTemplate: this.operationTpl(),
          width: 180,
          fixed: true,
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
