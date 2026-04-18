/* Hằng số cấu hình */

// Tiền tố token trong header
export const TokenPre = 'Bearer ';
// tokenKey
export const TokenKey = 'Authorization';
// Khóa cài đặt theme
export const ThemeOptionsKey = 'ThemeOptionsKey';
// Khóa kiểu theme: Alibaba, compact, mặc định, tối
export const StyleThemeModelKey = 'StyleThemeModelKey';
// Đánh dấu lần đăng nhập đầu tiên
export const IsFirstLogin = 'IsFirstLogin';
// Khóa màn hình khóa
export const LockedKey = 'LockedKey';
// Salt mã hóa
export const salt = 'EIpWsyfiy@R@X#qn17!StJNdZK1fFF8iV6ffN!goZkqt#JxO';

// Mã hết hạn đăng nhập → hiện hộp thoại đăng nhập
export const loginTimeOutCode = 1012;
// Mã token lỗi → đăng nhập lại
export const tokenErrorCode = 1010;

// Ngưỡng rộng tối đa để menu trái chuyển sang chế độ over
export const SideCollapsedMaxWidth = 700;
// Ngưỡng cho menu top chuyển over
export const TopCollapsedMaxWidth = 1253;

// Độ rộng menu trái (px)
export const SideNavWidth = 208; // Đổi thì đồng bộ @left-nav-width trong LESS
// Độ rộng menu trái khi thu gọn
export const CollapsedNavWidth = 48; // Đổi thì đồng bộ @collapsed-nav-width trong LESS
