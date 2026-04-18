import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewEncapsulation, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap } from 'rxjs/operators';

import { Menu } from '@core/services/types';
import { MenusService } from '@services/system/menus.service';
import { PutPermissionParam, RoleService } from '@services/system/role.service';
import { FooterSubmitComponent } from '@shared/components/footer-submit/footer-submit.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { fnAddTreeDataGradeAndLeaf, fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList } from '@utils/treeTableTools';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-set-role',
  templateUrl: './set-role.component.html',
  styleUrl: './set-role.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    NzCheckboxModule,
    FormsModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzResultModule,
    NgTemplateOutlet,
    FooterSubmitComponent,
    NzWaveModule
]
})
export class SetRoleComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Cài đặt quyền',
    desc: 'Vai trò hiện tại:',
    breadcrumb: ['Trang chủ', 'Quản lý người dùng', 'Quản lý vai trò', 'Cài đặt quyền']
  };
  authCodeArr: string[] = [];
  permissionList: Array<Menu & { isOpen?: boolean; checked?: boolean }> = [];
  destroyRef = inject(DestroyRef);
  readonly id = input.required<string>(); // Vai trò lấy từ định tuyếnid，ng16Các tính năng mới được hỗ trợ
  readonly roleName = input.required<string>(); // Lấy từ định tuyếnTên vai trgọi,ng16Các tính năng mới được hỗ trợ

  private dataService = inject(RoleService);
  private menusService = inject(MenusService);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  // Khởi tạo dữ liệu
  initPermission(): void {
    // Thông qua vai tròidLấy mã quyền mà vai trò này sở hữu
    this.dataService
      .getPermissionById(this.id())
      .pipe(
        concatMap(authCodeArr => {
          this.authCodeArr = authCodeArr;
          // Lấy tất cả các menu
          return this.menusService.getMenuList({ pageSize: 0, pageIndex: 0, filters: {} });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        // isOpenbiểu thị Nút có được mở rộng không
        const menuArray: Array<Menu & { isOpen?: boolean; checked?: boolean }> = response.list;
        menuArray.forEach(item => {
          item.isOpen = false;
          item.checked = this.authCodeArr.includes(item.code);
        });
        this.permissionList = fnAddTreeDataGradeAndLeaf(fnFlatDataHasParentToTree(menuArray));
        this.cdr.markForCheck();
      });
  }

  getRoleName(): void {
    this.pageHeaderInfo = { ...this.pageHeaderInfo, ...{ desc: `Vai trò hiện tại:${this.roleName()}` } };
    this.cdr.markForCheck();
  }

  back(): void {
    this.router.navigateByUrl(`/default/system/role-manager`);
  }

  submit(): void {
    const temp = [...this.permissionList];
    const flatArray = fnFlattenTreeDataByDataList(temp);
    const selectedAuthCodeArray: string[] = [];
    flatArray.forEach(item => {
      if (item['checked']) {
        selectedAuthCodeArray.push(item['code']);
      }
    });
    const param: PutPermissionParam = {
      permCodes: selectedAuthCodeArray,
      roleId: +this.id()
    };
    this.dataService
      .updatePermission(param)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.message.success('Cài đặt thành công, sẽ có hiệu lực sau khi đăng nhập lại');
      });
  }

  _onReuseInit(): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.getRoleName();
    this.initPermission();
  }
}
