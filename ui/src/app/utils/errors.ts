// Xử lý lỗi chung
export const throwAthError = (errorMsg: string): never => {
  throw new Error(errorMsg);
};

export const throwModalRefError = (): never => {
  return throwAthError('Có thể của bạnmodalKhông có nhập khẩu trong thành phầnoverride modalRef = inject(NzModalRef);');
};
export const throwModalGetCurrentFnError = (): never => {
  return throwAthError('Có thể của bạnmodalKhông có nhập khẩu trong thành phầngetCurrentValuePhương pháp, bạn cần ghi đè triển khai');
};
