/** Có phải là số không */
export function isNum(value: string | number): boolean {
  return /^((-?\d+\.\d+)|(-?\d+)|(-?\.\d+))$/.test(value.toString());
}

/** Có phải là số nguyên không */
export function isInt(value: string | number): boolean {
  return isNum(value) && parseInt(value.toString(), 10).toString() === value.toString();
}

/** Có phải là số thập phân không */
export function isDecimal(value: string | number): boolean {
  return isNum(value) && !isInt(value);
}

/** Có phải là chứng minh nhân dân không */
export function isIdCard(value: string): boolean {
  return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i.test(value);
}

/** Có phải là số điện thoại di động không */
export function isMobile(value: string): boolean {
  return /^(0|\+?86|17951)?(13[0-9]|15[0-9]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(value);
}

/** Có phải là số điện thoại không */
export function isTelPhone(value: string): boolean {
  return /^(0\d{2,3}-?)?\d{7,8}$/.test(value);
}

/** Có phải địa chỉ email không */
export function isEmail(value: string): boolean {
  return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
}

/** Mật khẩu do6đến20chữ cái hoa và thường */
export function isPasswordPass(value: string): boolean {
  const regTure = /^[^\s]{6,20}$/;
  const regFalse = /^\d+$/;
  return regTure.test(value) && !regFalse.test(value);
}
