import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { fnCheckForm } from '@utils/tools';

import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-search-table-detail',
  templateUrl: './search-table-detail.component.html',
  imports: [PageHeaderComponent, NzInputModule, FormsModule, NzDividerModule, NzFormModule, ReactiveFormsModule, NzGridModule]
})
export class SearchTableDetailComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Chi tiết',
    // desc: 'Trang biểu mẫu được dùng để thu thập hoặc xác minh thông tin từ người dùng, các biểu mẫu cơ bản thường xuất hiện trong các tình huống biểu mẫu có ít mục dữ liệu.',
    breadcrumb: ['Trang chủ', 'Trang danh sách', 'Bảng tra cứu', 'Chi tiết']
  };
  validateForm!: FormGroup;
  name = input.required<string>(); // Các tham số lấy từ đường dẫn,ng16Các tính năng mới được hỗ trợ
  backUrl = '/default/page-demo/list/search-table';
  destroyRef = inject(DestroyRef);

  private fb = inject(FormBuilder);

  initForm(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
  }

  _onReuseDestroy(): void {
    console.log('tabĐã hủy, gọi_OnReuseDestroy');
  }

  ngOnInit(): void {
    this.initForm();
    this.validateForm.get('userName')?.setValue(this.name());
  }
}
