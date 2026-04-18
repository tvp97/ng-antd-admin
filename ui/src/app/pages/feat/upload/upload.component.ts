import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '@env/environment';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { fnCheckForm } from '@utils/tools';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, NzUploadModule, NzButtonModule, NzWaveModule, NzIconModule, FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule]
})
export class UploadComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Tải tệp lên',
    breadcrumb: ['Trang chủ', 'chức năng', 'Tải tệp lên'],
    desc: 'Làm đơn giản một chút,Quay lạiĐều là máy chủ thống nhấtQuay lạitài liệu'
  };
  uploadUrl = environment.production ? '/api/file/test/upload/document/' : '/site/api/file/test/upload/document/';
  fileList: NzUploadFile[] = [];
  fileFormList: NzUploadFile[] = [];
  validateForm!: FormGroup;
  private message = inject(NzMessageService);
  private fb = inject(FormBuilder);

  handleChange(info: NzUploadChangeParam): void {
    if (info.type === 'success') {
      if (info.file.response.code === 0) {
        this.message.success(`trên máy chủQuay lạiĐường dẫn tệp:${info.file.response.data.data}`);
      }
    }
  }

  uploadFn(e: NzUploadChangeParam): void {
    if (e.type === 'success') {
      if (e.file.response.code === 0) {
        this.validateForm.get('file')?.setValue(e.file.response.data.data);
      }
    }
  }

  resetForm(): void {
    this.validateForm.reset();
    this.fileFormList = [];
  }

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
  }

  initForm(): void {
    this.validateForm = this.fb.group({
      file: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.initForm();
  }
}
