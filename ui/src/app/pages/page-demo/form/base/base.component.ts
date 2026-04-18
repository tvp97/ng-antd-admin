import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { fnCheckForm } from '@utils/tools';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrl: './base.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzCardModule,

    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSelectModule,
    NzButtonModule,
    NzWaveModule
  ]
})
export class BaseComponent implements OnInit, AfterViewInit {
  readonly dragTpl = viewChild.required<TemplateRef<NzSafeAny>>('dragTpl');
  readonly baseForm = viewChild.required<FormGroup>('baseForm');
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Biểu mẫu cơ bản',
    desc: 'Trang biểu mẫu được dùng để thu thập hoặc xác minh thông tin từ người dùng, các biểu mẫu cơ bản thường xuất hiện trong các tình huống biểu mẫu có ít mục dữ liệu.',
    breadcrumb: ['Trang chủ', 'Trang biểu mẫu', 'Biểu mẫu cơ bản']
  };
  listOfOption = [
    { label: 'Đồng nghiệp A', value: 'Đồng nghiệp A' },
    { label: 'Đồng nghiệp B', value: 'Đồng nghiệp B' },
    { label: 'Đồng nghiệp B', value: 'Đồng nghiệp B' }
  ];
  destroyRef = inject(DestroyRef);

  validateForm!: FormGroup;

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
  }
  private fb = inject(FormBuilder);

  initForm(): void {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      date: [null, [Validators.required]],
      desc: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      client: [null],
      invitedCommenter: [null],
      weights: [null],
      isPublic: [null]
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    // Dù là biểu mẫu dạng mẫu hay biểu mẫu phản hồi, đều có thể sử dụng cách này để lắng nghe sự thay đổi của dữ liệu biểu mẫu
    this.baseForm()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        console.log(res);
      });
  }
}
