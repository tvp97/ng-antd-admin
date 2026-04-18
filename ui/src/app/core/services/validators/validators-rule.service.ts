import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { isEmail, isMobile, isPasswordPass, isTelPhone } from '@utils/validate/validate';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsRuleService {
  mobileRule(value: string): ValidationErrors | null {
    if (!value) {
      return null;
    }
    return isMobile(value) ? null : { message: 'Vui lòng nhập số điện thoại hợp lệ' };
  }

  telPhoneRule(value: string): ValidationErrors | null {
    if (!value) {
      return null;
    }
    return isTelPhone(value) ? null : { message: 'Vui lòng nhập số điện thoại đúng' };
  }

  emailRule(value: string): ValidationErrors | null {
    if (!value) {
      return null;
    }
    return isEmail(value) ? null : { message: 'Vui lòng nhập định dạng email đúng' };
  }

  passwordRule(value: string): ValidationErrors | null {
    if (!value) {
      return null;
    }
    return isPasswordPass(value) ? null : { message: 'Mật khẩu do6đến20bao gồm các chữ cái hoa và thường, chữ số hoặc các ký tự khác' };
  }
}
