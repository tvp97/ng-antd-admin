/*
 * chunginterface
 * */

import { Type } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

// Hoạt độngThành phần
export class DynamicComponent {
  constructor(
    public component: Type<NzSafeAny>,
    public data: NzSafeAny
  ) {}
}

// selectKéo xuống
export interface OptionsInterface {
  value: number | string;
  label: string;
}

// Danh sáchTìm kiếm
export interface SearchCommonVO<T> {
  pageIndex: number;
  pageSize: number;
  filters?: T;
}

// Phân trang
export interface PageInfo<T> {
  pageIndex: number;
  pageSize: number;
  size?: number;
  orderBy?: string;
  startRow?: number;
  endRow?: number;
  total: number;
  pages?: number;
  list: T[];
  firstPage?: number;
  prePage?: number;
  nextPage?: number;
  lastPage?: number;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  navigatePages?: number;
  navigatepageIndexs?: number[];
}

// Hoạt độngThành phần
export interface AdComponent {
  data: NzSafeAny;
}

// Cấu trúc dữ liệu lựa chọn theo cấp
export interface CascaderOption {
  value: number | string;
  label: string;
  children?: CascaderOption[];
  isLeaf?: boolean;
}

/*
 * Thực đơn
 * */
export interface Menu {
  id: number | string;
  fatherId: number | string;
  path: string;
  orderNum?: number;
  menuName: string;
  menuType: 'C' | 'F'; // c:Thực đơn,fnút bấm
  icon?: string; // nếushowIconvìfalsethiết lập cái này thànhTìm kiếmKhi cửa sổ, bên trái nhấticon
  alIcon?: string; // nếushowIconvìfalsethiết lập cái này thànhTìm kiếmKhi cửa sổ, bên trái nhấticon
  updatedAt?: string;
  createdAt?: string;
  deletedAt?: string;
  open?: boolean;
  selected?: boolean; // Có được chọn không
  status?: boolean; // Có tắt không
  visible?: boolean; // Có thể nhìn thấy không
  children?: Menu[];
  code: string; // Mã quyền hạn
  newLinkFlag?: 0 | 1; // Có phải là trang mới không
}
