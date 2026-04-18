import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ValidatorsRuleService } from './validators-rule.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  private vrService = inject(ValidatorsRuleService);

  // Xác thực email
  public emailValidator(): ValidatorFn | null {
    return this.commonUtil(this.vrService.emailRule);
  }

  // Xác minh số điện thoại di động
  public mobileValidator(): ValidatorFn | null {
    return this.commonUtil(this.vrService.mobileRule);
  }

  // Xác thực mật khẩu
  public passwordValidator(): ValidatorFn | null {
    return this.commonUtil(this.vrService.passwordRule);
  }

  // Xác minh số điện thoại
  public telephoneValidator(): ValidatorFn {
    return this.commonUtil(this.vrService.telPhoneRule);
  }

  private commonUtil(ruleFun: (value: string) => ValidationErrors | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return ruleFun(control.value);
    };
  }
}
