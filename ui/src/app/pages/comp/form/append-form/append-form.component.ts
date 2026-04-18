import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ModalBtnStatus } from '@widget/base-modal';
import { AppendFormModalService } from '@widget/biz-widget/form/append-form-modal/append-form-modal.service';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

/*
 * Đối tượng nhiệm vụ
 * */
export interface TaskObj {
  id: number;
  taskName: string;
  taskDesc: string;
  taskEvaluate: null;
  equipmentId: number;
  equipmentName: string;
  systemName: string;
  systemId: number;
  taskState: number;
  userName: string;
  taskStateName: string;
  taskUserId: string | string[];
  checkPeriod: string;
  createTime: number;
  updateTime: number;
  endTime: number;
  startTime: number;
  finishRate: number;
}

// nhiệm vụTìm kiếmĐiều kiện
export enum TaskStateSearchEnum {
  NoStarted,
  Processing,
  Complete,
  Overdue,
  All
}

// nhiệm vụTìm kiếmĐiều kiện
export enum TaskStateSearchCheckPeriodEnum {
  DayCheck,
  MonthCheck,
  QuarterlyCheck,
  YearCheck,
  All
}

@Component({
  selector: 'app-append-form',
  templateUrl: './append-form.component.html',
  styleUrl: './append-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    NzGridModule,
    NzTypographyModule,
    NzDividerModule,
    NzRadioModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzWaveModule,
    NzIconModule,
    NzListModule,
    NzDropdownModule,
    NzMenuModule,
    NzTagModule,
    NzProgressModule,
    NzPaginationModule,
    DatePipe,
    NzFormModule,
    ReactiveFormsModule
  ]
})
export class AppendFormComponent implements OnInit {
  private modalService = inject(AppendFormModalService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  destroyRef = inject(DestroyRef);
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ thêm và xóa biểu mẫu',
    breadcrumb: ['Trang chủ', 'Thành phần', 'Form', 'Thêm và xóa biểu mẫu'],
    desc: 'Ví dụ thêm và xóa biểu mẫu'
  };
  taskStateSearchEnum = TaskStateSearchEnum;
  taskState = TaskStateSearchEnum.All;
  taskCheckPeriodState = TaskStateSearchCheckPeriodEnum.All;
  pageObj = {
    pageSize: 3,
    pageIndex: 1
  };
  showTaskList: TaskObj[] = [];
  showAllTaskList: TaskObj[] = [
    {
      id: 1,
      taskName: 'Một nhiệm vụ',
      taskDesc: 'Một nhiệm vụ',
      taskEvaluate: null,
      equipmentId: 1,
      equipmentName: 'Một nhiệm vụ',
      systemName: 'Một nhiệm vụ',
      systemId: 1,
      taskState: 1,
      userName: 'Hoa',
      taskStateName: 'Một nhiệm vụ',
      taskUserId: 'Một nhiệm vụ',
      checkPeriod: 'Một nhiệm vụ',
      createTime: 1,
      updateTime: 1,
      endTime: 1,
      startTime: 1,
      finishRate: 1
    },
    {
      id: 2,
      taskName: 'Một nhiệm vụ',
      taskDesc: 'Một nhiệm vụ',
      taskEvaluate: null,
      equipmentId: 1,
      equipmentName: 'Một nhiệm vụ',
      systemName: 'Một nhiệm vụ',
      systemId: 1,
      taskState: 1,
      userName: 'Tiểu Trương',
      taskStateName: 'Một nhiệm vụ',
      taskUserId: 'Một nhiệm vụ',
      checkPeriod: 'Một nhiệm vụ',
      createTime: 1,
      updateTime: 1,
      endTime: 1,
      startTime: 1,
      finishRate: 1
    },
    {
      id: 1,
      taskName: 'Một nhiệm vụ',
      taskDesc: 'Một nhiệm vụ',
      taskEvaluate: null,
      equipmentId: 1,
      equipmentName: 'Một nhiệm vụ',
      systemName: 'Một nhiệm vụ',
      systemId: 1,
      taskState: 1,
      userName: 'Tiểu Lâm',
      taskStateName: 'Một nhiệm vụ',
      taskUserId: 'Một nhiệm vụ',
      checkPeriod: 'Một nhiệm vụ',
      createTime: 1,
      updateTime: 1,
      endTime: 1,
      startTime: 1,
      finishRate: 1
    },
    {
      id: 1,
      taskName: 'Một nhiệm vụ',
      taskDesc: 'Một nhiệm vụ',
      taskEvaluate: null,
      equipmentId: 1,
      equipmentName: 'Một nhiệm vụ',
      systemName: 'Một nhiệm vụ',
      systemId: 1,
      taskState: 1,
      userName: 'Tên nhóc',
      taskStateName: 'Một nhiệm vụ',
      taskUserId: 'Một nhiệm vụ',
      checkPeriod: 'Một nhiệm vụ',
      createTime: 1,
      updateTime: 1,
      endTime: 1,
      startTime: 1,
      finishRate: 1
    }
  ];
  taskCheckPeriodStateEnum = TaskStateSearchCheckPeriodEnum;
  loading = false;

  validateForm = this.fb.group({
    formArray: this.fb.array([this.creatForm()])
  });

  get valuesArray(): FormArray {
    return this.validateForm.controls['formArray'] as FormArray;
  }

  add2form(): void {
    this.valuesArray.insert(0, this.creatForm(), { emitEvent: false });
  }

  updateFormItem(): void {
    // this.valuesArray.at(0).setValue({ detail: 111 });
    this.valuesArray.setControl(0, this.fb.group({ detail: 555 }));
    // this.valuesArray.at(0).patchValue({ detail: 333 });
  }

  creatForm(): FormGroup {
    return this.fb.group({
      detail: [null]
    });
  }

  del(groupIndex: number): void {
    this.valuesArray.removeAt(groupIndex);
  }
  addForm(): void {
    this.valuesArray.push(this.creatForm());
  }

  pageSizeChange(event: number): void {
    this.pageObj = { ...this.pageObj, pageSize: event };
    this.getData(1);
  }

  submitForm(): void {
    console.log(this.validateForm.value);
  }

  searchTask(): void {
    this.pageObj = { ...this.pageObj, pageIndex: 1 };

    this.showAllTaskList = this.showAllTaskList.filter(() => {
      return true;
    });

    this.pageSizeChange(this.pageObj.pageSize);
  }

  add(): void {
    this.modalService
      .show({ nzTitle: 'Thêm mới' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ modalValue, status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        this.showAllTaskList.push(modalValue);
        this.getData(1);
        console.log(modalValue);
      });
  }

  onEllipsisChange(ellipsis: boolean): void {
    // console.log(ellipsis);
  }

  // Lấy dữ liệu theo phân trang
  getData(event: number = this.pageObj.pageIndex): void {
    this.pageObj = { ...this.pageObj, pageIndex: event };
    this.showTaskList = [...this.showAllTaskList.slice((this.pageObj.pageIndex - 1) * this.pageObj.pageSize, this.pageObj.pageIndex * this.pageObj.pageSize)];
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.validateForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      console.log(res);
    });
    this.getData(1);
  }
}
