import { http, HttpResponse } from 'msw';

interface Menu {
  id: number;
  fatherId: number;
  menuName: string;
  menuType: string;
  alIcon: string;
  icon: string;
  path: string;
  code: string;
  orderNum: number;
  status: boolean;
  newLinkFlag: boolean;
  visible: boolean;
}

let menus: Menu[] = [
  { id: 1, fatherId: 0, menuName: 'Bảng điều khiển', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/dashboard', code: 'default:dashboard', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 2, fatherId: 0, menuName: 'Trang', menuType: 'C', alIcon: '', icon: 'appstore', path: '/default/page-demo', code: 'default:page-demo', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 3, fatherId: 0, menuName: 'Tính năng', menuType: 'C', alIcon: '', icon: 'star', path: '/default/feat', code: 'default:feat', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 4, fatherId: 0, menuName: 'Thành phần', menuType: 'C', alIcon: '', icon: 'star', path: '/default/comp', code: 'default:comp', orderNum: 4, status: true, newLinkFlag: false, visible: true },
  { id: 5, fatherId: 0, menuName: 'Menu đa cấp', menuType: 'C', alIcon: '', icon: 'menu', path: '/default/level', code: 'default:level', orderNum: 5, status: true, newLinkFlag: false, visible: true },
  { id: 6, fatherId: 0, menuName: 'Quản trị hệ thống', menuType: 'C', alIcon: '', icon: 'menu', path: '/default/system', code: 'default:system', orderNum: 6, status: true, newLinkFlag: false, visible: true },
  { id: 7, fatherId: 0, menuName: 'Giới thiệu', menuType: 'C', alIcon: '', icon: 'apple', path: '/default/about', code: 'default:about', orderNum: 7, status: true, newLinkFlag: false, visible: true },
  { id: 8, fatherId: 1, menuName: 'Phân tích', menuType: 'C', alIcon: '', icon: 'fund', path: '/default/dashboard/analysis', code: 'default:dashboard:analysis', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 9, fatherId: 1, menuName: 'Giám sát', menuType: 'C', alIcon: '', icon: 'fund', path: '/default/dashboard/monitor', code: 'default:dashboard:monitor', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 10, fatherId: 1, menuName: 'Bàn làm việc', menuType: 'C', alIcon: '', icon: 'appstore', path: '/default/dashboard/workbench', code: 'default:dashboard:workbench', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 11, fatherId: 2, menuName: 'Biểu mẫu', menuType: 'C', alIcon: '', icon: 'form', path: '/default/page-demo/form', code: 'default:page-demo:form', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 12, fatherId: 2, menuName: 'Danh sách', menuType: 'C', alIcon: '', icon: 'table', path: '/default/page-demo/list', code: 'default:page-demo:list', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 13, fatherId: 2, menuName: 'Chi tiết', menuType: 'C', alIcon: '', icon: 'profile', path: '/default/page-demo/detail', code: 'default:page-demo:detail', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 14, fatherId: 2, menuName: 'Kết quả', menuType: 'C', alIcon: '', icon: 'check-circle', path: '/default/page-demo/result', code: 'default:page-demo:result', orderNum: 4, status: true, newLinkFlag: false, visible: true },
  { id: 15, fatherId: 2, menuName: 'Lỗi / ngoại lệ', menuType: 'C', alIcon: '', icon: 'warning', path: '/default/page-demo/except', code: 'default:page-demo:except', orderNum: 5, status: true, newLinkFlag: false, visible: true },
  { id: 16, fatherId: 2, menuName: 'Cá nhân', menuType: 'C', alIcon: '', icon: 'user', path: '/default/page-demo/personal', code: 'default:page-demo:personal', orderNum: 6, status: true, newLinkFlag: false, visible: true },
  { id: 17, fatherId: 2, menuName: 'Sơ đồ / flow', menuType: 'C', alIcon: 'icon-mel-help', icon: '', path: '/default/page-demo/flow', code: 'default:page-demo:flow', orderNum: 7, status: true, newLinkFlag: false, visible: true },
  { id: 18, fatherId: 2, menuName: 'Nhiệm vụ', menuType: 'C', alIcon: '', icon: 'border-bottom', path: '/default/page-demo/task', code: 'default:page-demo:task', orderNum: 8, status: true, newLinkFlag: false, visible: true },
  { id: 19, fatherId: 2, menuName: 'Bố cục mới', menuType: 'C', alIcon: '', icon: 'caret-down', path: '/default/page-demo/page-demo1', code: 'default:page-demo:page-demo1', orderNum: 9, status: true, newLinkFlag: false, visible: true },
  { id: 20, fatherId: 2, menuName: 'Trang mới 2', menuType: 'C', alIcon: '', icon: 'up', path: '/default/page-demo/page-demo2', code: 'default:page-demo:page-demo2', orderNum: 10, status: true, newLinkFlag: false, visible: true },
  { id: 21, fatherId: 2, menuName: 'Trang mới 3', menuType: 'C', alIcon: '', icon: 'down', path: '/default/page-demo/page-demo3', code: 'default:page-demo:page-demo3', orderNum: 11, status: true, newLinkFlag: false, visible: true },
  { id: 22, fatherId: 2, menuName: 'Trang mới 4', menuType: 'C', alIcon: '', icon: 'caret-down', path: '/default/page-demo/page-demo4', code: 'default:page-demo:page-demo4', orderNum: 12, status: true, newLinkFlag: false, visible: true },
  { id: 23, fatherId: 3, menuName: 'Thông báo', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/msg', code: 'default:feat:msg', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 24, fatherId: 3, menuName: 'Biểu tượng', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/icons', code: 'default:feat:icons', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 25, fatherId: 3, menuName: 'Menu chuột phải', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/context-menu', code: 'default:feat:context-menu', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 26, fatherId: 3, menuName: 'Xem trước ảnh', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/img-preview', code: 'default:feat:img-preview', orderNum: 4, status: true, newLinkFlag: false, visible: true },
  { id: 27, fatherId: 3, menuName: 'Toàn màn hình', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/full-screen', code: 'default:feat:full-screen', orderNum: 5, status: true, newLinkFlag: false, visible: true },
  { id: 28, fatherId: 3, menuName: 'Thao tác tab', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/tabs', code: 'default:feat:tabs', orderNum: 6, status: true, newLinkFlag: false, visible: true },
  { id: 29, fatherId: 3, menuName: 'Modal kéo thả', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/ex-modal', code: 'default:feat:ex-modal', orderNum: 7, status: true, newLinkFlag: false, visible: true },
  { id: 30, fatherId: 3, menuName: 'Drawer bọc', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/ex-drawer', code: 'default:feat:ex-drawer', orderNum: 8, status: true, newLinkFlag: false, visible: true },
  { id: 31, fatherId: 3, menuName: 'Văn bản định dạng', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/rich-text', code: 'default:feat:rich-text', orderNum: 9, status: true, newLinkFlag: false, visible: true },
  { id: 32, fatherId: 3, menuName: 'clickOutSide', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/click-out-side', code: 'default:feat:click-out-side', orderNum: 10, status: true, newLinkFlag: false, visible: true },
  { id: 33, fatherId: 3, menuName: 'Tài liệu ngoài', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/frame', code: 'default:feat:frame', orderNum: 11, status: true, newLinkFlag: false, visible: true },
  { id: 34, fatherId: 3, menuName: 'Thanh cuộn', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/scroll', code: 'default:feat:scroll', orderNum: 12, status: true, newLinkFlag: false, visible: true },
  { id: 35, fatherId: 3, menuName: 'Biểu đồ', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/charts', code: 'default:feat:charts', orderNum: 13, status: true, newLinkFlag: false, visible: true },
  { id: 36, fatherId: 3, menuName: 'Đăng nhập khác', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/blank/other-login', code: 'blank:other-login', orderNum: 14, status: true, newLinkFlag: false, visible: true },
  { id: 37, fatherId: 3, menuName: 'Chọn màu', menuType: 'C', alIcon: '', icon: 'usergroup-delete', path: '/default/feat/color-sel', code: 'default:feat:color-sel', orderNum: 15, status: true, newLinkFlag: false, visible: true },
  { id: 38, fatherId: 3, menuName: 'Hiệu ứng gợn sóng', menuType: 'C', alIcon: '', icon: 'usergroup-delete', path: '/default/feat/ripple', code: 'default:feat:ripple', orderNum: 16, status: true, newLinkFlag: false, visible: true },
  { id: 39, fatherId: 3, menuName: 'Bảng tạm', menuType: 'C', alIcon: '', icon: 'usergroup-delete', path: '/default/feat/copy', code: 'default:feat:copy', orderNum: 17, status: true, newLinkFlag: false, visible: true },
  { id: 40, fatherId: 3, menuName: 'Trang trống', menuType: 'C', alIcon: '', icon: 'usergroup-delete', path: '/blank/empty-page', code: 'blank:empty-page', orderNum: 18, status: true, newLinkFlag: false, visible: true },
  { id: 41, fatherId: 3, menuName: 'Hướng dẫn (tour)', menuType: 'C', alIcon: '', icon: 'codepen', path: '/default/feat/setup', code: 'default:feat:setup', orderNum: 19, status: true, newLinkFlag: false, visible: true },
  { id: 42, fatherId: 3, menuName: 'Hết phiên đăng nhập', menuType: 'C', alIcon: '', icon: 'yuque', path: '/default/feat/session-timeout', code: 'default:feat:session-timeout', orderNum: 20, status: true, newLinkFlag: false, visible: true },
  { id: 43, fatherId: 3, menuName: 'websocket', menuType: 'C', alIcon: '', icon: 'border-horizontal', path: '/default/feat/websocket', code: 'default:feat:websocket', orderNum: 21, status: true, newLinkFlag: false, visible: true },
  { id: 44, fatherId: 3, menuName: 'Tải xuống tệp', menuType: 'C', alIcon: '', icon: 'arrow-down', path: '/default/feat/download', code: 'default:feat:download', orderNum: 23, status: true, newLinkFlag: false, visible: true },
  { id: 45, fatherId: 3, menuName: 'Tải lên tệp', menuType: 'C', alIcon: '', icon: 'up', path: '/default/feat/upload', code: 'default:feat:upload', orderNum: 22, status: true, newLinkFlag: false, visible: true },
  { id: 46, fatherId: 3, menuName: 'Mã QR', menuType: 'C', alIcon: '', icon: 'gitlab', path: '/default/feat/qrcode', code: 'default:feat:qrcode', orderNum: 24, status: true, newLinkFlag: false, visible: true },
  { id: 47, fatherId: 3, menuName: 'Watermark', menuType: 'C', alIcon: '', icon: 'windows', path: '/default/feat/water-mark', code: 'default:feat:water-mark', orderNum: 25, status: true, newLinkFlag: false, visible: true },
  { id: 48, fatherId: 3, menuName: 'KeepAlive', menuType: 'C', alIcon: '', icon: 'border-horizontal', path: '/default/feat/keep-alive', code: 'default:feat:keep-alive', orderNum: 26, status: true, newLinkFlag: false, visible: true },
  { id: 49, fatherId: 4, menuName: 'Thành phần cơ bản', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/comp/basic', code: 'default:comp:basic', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 50, fatherId: 4, menuName: 'Hoạt ảnh', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/comp/transition', code: 'default:comp:transition', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 51, fatherId: 4, menuName: 'Excel trực tuyến', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/comp/luckysheet', code: 'default:comp:luckysheet', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 52, fatherId: 4, menuName: 'Lazy load', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/comp/lazy', code: 'default:comp:lazy', orderNum: 4, status: true, newLinkFlag: false, visible: true },
  { id: 53, fatherId: 4, menuName: 'Mô tả chi tiết', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/comp/desc', code: 'default:comp:desc', orderNum: 5, status: true, newLinkFlag: false, visible: true },
  { id: 54, fatherId: 4, menuName: 'Độ mạnh mật khẩu', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/comp/strength-meter', code: 'default:comp:strength-meter', orderNum: 6, status: true, newLinkFlag: false, visible: true },
  { id: 55, fatherId: 4, menuName: 'Form', menuType: 'C', alIcon: '', icon: 'form', path: '/default/comp/form', code: 'default:comp:form', orderNum: 7, status: true, newLinkFlag: false, visible: true },
  { id: 56, fatherId: 4, menuName: 'blingbling', menuType: 'C', alIcon: '', icon: 'caret-down', path: '/default/comp/blingbling', code: 'default:comp:blingbling', orderNum: 8, status: true, newLinkFlag: false, visible: true },
  { id: 57, fatherId: 5, menuName: 'Menu1', menuType: 'C', alIcon: '', icon: 'menu', path: '/default/level/menu1', code: 'default:level:menu1', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 58, fatherId: 5, menuName: 'Menu2', menuType: 'C', alIcon: '', icon: 'menu', path: '/default/level/menu2', code: 'default:level:menu2', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 59, fatherId: 6, menuName: 'Tài khoản', menuType: 'C', alIcon: '', icon: 'menu', path: '/default/system/account', code: 'default:system:account', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 60, fatherId: 6, menuName: 'Vai trò', menuType: 'C', alIcon: 'icon-mel-help', icon: '', path: '/default/system/role-manager', code: 'default:system:role-manager', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 61, fatherId: 6, menuName: 'Menu', menuType: 'C', alIcon: '', icon: 'menu', path: '/default/system/menu', code: 'default:system:menu', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 62, fatherId: 6, menuName: 'Phòng ban', menuType: 'C', alIcon: 'icon-mel-help', icon: '', path: '/default/system/dept', code: 'default:system:dept', orderNum: 4, status: true, newLinkFlag: false, visible: true },
  { id: 63, fatherId: 11, menuName: 'Biểu mẫu cơ bản', menuType: 'C', alIcon: '', icon: 'form', path: '/default/page-demo/form/base-form', code: 'default:page-demo:form:base-form', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 64, fatherId: 11, menuName: 'Biểu mẫu nhiều bước', menuType: 'C', alIcon: '', icon: 'form', path: '/default/page-demo/form/step-form', code: 'default:page-demo:form:step-form', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 65, fatherId: 11, menuName: 'Biểu mẫu nâng cao', menuType: 'C', alIcon: '', icon: 'form', path: '/default/page-demo/form/advanced-form', code: 'default:page-demo:form:advanced-form', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 66, fatherId: 12, menuName: 'Danh sách tìm kiếm', menuType: 'C', alIcon: '', icon: '', path: '/default/page-demo/list/search-list', code: 'default:page-demo:list:search-list', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 67, fatherId: 12, menuName: 'Bảng tra cứu', menuType: 'C', alIcon: '', icon: 'table', path: '/default/page-demo/list/search-table', code: 'default:page-demo:list:search-table', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 68, fatherId: 12, menuName: 'Bảng cây', menuType: 'C', alIcon: '', icon: 'table', path: '/default/page-demo/list/tree-list', code: 'default:page-demo:list:tree-list', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 69, fatherId: 12, menuName: 'Bảng chuẩn', menuType: 'C', alIcon: '', icon: 'table', path: '/default/page-demo/list/standard-table', code: 'default:page-demo:list:standard-table', orderNum: 4, status: true, newLinkFlag: false, visible: true },
  { id: 70, fatherId: 12, menuName: 'Danh sách thẻ', menuType: 'C', alIcon: '', icon: 'table', path: '/default/page-demo/list/card-table', code: 'default:page-demo:list:card-table', orderNum: 5, status: true, newLinkFlag: false, visible: true },
  { id: 71, fatherId: 13, menuName: 'Chi tiết cơ bản', menuType: 'C', alIcon: '', icon: 'profile', path: '/default/page-demo/detail/base-detail', code: 'default:page-demo:detail:base-detail', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 72, fatherId: 13, menuName: 'Chi tiết nâng cao', menuType: 'C', alIcon: '', icon: 'profile', path: '/default/page-demo/detail/adv-detail', code: 'default:page-demo:detail:adv-detail', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 73, fatherId: 14, menuName: 'Thành công', menuType: 'C', alIcon: '', icon: 'check-circle', path: '/default/page-demo/result/success', code: 'default:page-demo:result:success', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 74, fatherId: 14, menuName: 'Thất bại', menuType: 'C', alIcon: '', icon: 'check-circle', path: '/default/page-demo/result/fail', code: 'default:page-demo:result:fail', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 75, fatherId: 15, menuName: '403', menuType: 'C', alIcon: '', icon: 'warning', path: '/default/page-demo/except/except403', code: 'default:page-demo:except:except403', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 76, fatherId: 15, menuName: '404', menuType: 'C', alIcon: '', icon: 'warning', path: '/default/page-demo/except/except404', code: 'default:page-demo:except:except404', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 77, fatherId: 15, menuName: '500', menuType: 'C', alIcon: '', icon: 'warning', path: '/default/page-demo/except/except500', code: 'default:page-demo:except:except500', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 78, fatherId: 15, menuName: 'Lỗi mạng', menuType: 'C', alIcon: '', icon: 'warning', path: '/default/page-demo/except/network-error', code: 'default:page-demo:except:network-error', orderNum: 4, status: true, newLinkFlag: false, visible: true },
  { id: 79, fatherId: 15, menuName: 'Không có dữ liệu', menuType: 'C', alIcon: '', icon: 'warning', path: '/default/page-demo/except/no-data', code: 'default:page-demo:except:no-data', orderNum: 5, status: true, newLinkFlag: false, visible: true },
  { id: 80, fatherId: 16, menuName: 'Trung tâm cá nhân', menuType: 'C', alIcon: '', icon: 'user', path: '/default/page-demo/personal/personal-center', code: 'default:page-demo:personal:personal-center', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 81, fatherId: 16, menuName: 'Cài đặt cá nhân', menuType: 'C', alIcon: '', icon: 'user', path: '/default/page-demo/personal/personal-setting', code: 'default:page-demo:personal:personal-setting', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 82, fatherId: 17, menuName: 'Sơ đồ chat', menuType: 'C', alIcon: '', icon: 'highlight', path: '/default/page-demo/flow/flow-chat', code: 'default:page-demo:flow:flow-chat', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 83, fatherId: 33, menuName: 'Tài liệu Zorro', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/frame/zorro-doc', code: 'default:feat:frame:zorro-doc', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 84, fatherId: 33, menuName: 'Liên kết ngoài', menuType: 'C', alIcon: '', icon: 'usergroup-delete', path: 'https://github.com/huajian123/ng-antd-admin', code: 'https://github.com/huajian123/ng-antd-admin', orderNum: 2, status: true, newLinkFlag: true, visible: true },
  { id: 85, fatherId: 34, menuName: 'Cuộn có bộ nhớ đệm', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/scroll/keep-scroll-page', code: 'default:feat:scroll:keep-scroll-page', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 86, fatherId: 34, menuName: 'Demo thanh cuộn', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/feat/scroll/play-scroll', code: 'default:feat:scroll:play-scroll', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 87, fatherId: 35, menuName: 'Amap (Gaode)', menuType: 'C', alIcon: '', icon: 'highlight', path: '/default/feat/charts/gaode-map', code: 'default:feat:charts:gaode-map', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 88, fatherId: 35, menuName: 'Baidu', menuType: 'C', alIcon: '', icon: 'highlight', path: '/default/feat/charts/baidu-map', code: 'default:feat:charts:baidu-map', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 89, fatherId: 35, menuName: 'Echarts', menuType: 'C', alIcon: '', icon: 'highlight', path: '/default/feat/charts/echarts', code: 'default:feat:charts:echarts', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 90, fatherId: 36, menuName: 'Kiểu 1', menuType: 'C', alIcon: '', icon: 'highlight', path: '/blank/other-login/login1', code: 'blank:other-login:login1', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 91, fatherId: 52, menuName: 'Lazy load cơ bản', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/comp/lazy/lazy-basic', code: 'default:comp:lazy:lazy-basic', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 92, fatherId: 52, menuName: 'Lazy load khi cuộn', menuType: 'C', alIcon: '', icon: 'dashboard', path: '/default/comp/lazy/lazy-scroll', code: 'default:comp:lazy:lazy-scroll', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 93, fatherId: 55, menuName: 'Form thu gọn', menuType: 'C', alIcon: '', icon: 'minus-square', path: '/default/comp/form/shrink-form', code: 'default:comp:form:shrink-form', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 94, fatherId: 55, menuName: 'Thêm/xóa dòng form', menuType: 'C', alIcon: '', icon: 'chrome', path: '/default/comp/form/append-form', code: 'default:comp:form:append-form', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 95, fatherId: 57, menuName: 'Menu1-1', menuType: 'C', alIcon: '', icon: '', path: '/default/level/menu1/menu1-1', code: 'default:level:menu1:menu1-1', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 96, fatherId: 57, menuName: 'Menu1-2', menuType: 'C', alIcon: '', icon: 'menu', path: '/default/level/menu1/menu1-2', code: 'default:level:menu1:menu1-2', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 97, fatherId: 59, menuName: 'Thêm tài khoản', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:account:add', orderNum: 1, status: true, newLinkFlag: false, visible: false },
  { id: 98, fatherId: 59, menuName: 'Sửa tài khoản', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:account:edit', orderNum: 2, status: true, newLinkFlag: false, visible: false },
  { id: 99, fatherId: 59, menuName: 'Xóa tài khoản', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:account:del', orderNum: 3, status: true, newLinkFlag: false, visible: false },
  { id: 100, fatherId: 60, menuName: 'Thêm vai trò', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:role-manager:add', orderNum: 1, status: true, newLinkFlag: false, visible: false },
  { id: 101, fatherId: 60, menuName: 'Sửa vai trò', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:role-manager:edit', orderNum: 2, status: true, newLinkFlag: false, visible: false },
  { id: 102, fatherId: 60, menuName: 'Xóa vai trò', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:role-manager:del', orderNum: 3, status: true, newLinkFlag: false, visible: false },
  { id: 103, fatherId: 60, menuName: 'Gán quyền vai trò', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:role-manager:set-role', orderNum: 4, status: true, newLinkFlag: false, visible: false },
  { id: 104, fatherId: 61, menuName: 'Thêm menu', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:menu:add', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 105, fatherId: 61, menuName: 'Sửa menu', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:menu:edit', orderNum: 2, status: true, newLinkFlag: false, visible: false },
  { id: 106, fatherId: 61, menuName: 'Xóa menu', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:menu:del', orderNum: 3, status: true, newLinkFlag: false, visible: false },
  { id: 107, fatherId: 61, menuName: 'Thêm menu con', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:menu:addlowlevel', orderNum: 4, status: true, newLinkFlag: false, visible: false },
  { id: 108, fatherId: 62, menuName: 'Thêm phòng ban', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:dept:add', orderNum: 1, status: true, newLinkFlag: false, visible: false },
  { id: 109, fatherId: 62, menuName: 'Sửa phòng ban', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:dept:edit', orderNum: 2, status: true, newLinkFlag: false, visible: false },
  { id: 110, fatherId: 62, menuName: 'Xóa phòng ban', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:dept:del', orderNum: 3, status: true, newLinkFlag: false, visible: false },
  { id: 111, fatherId: 62, menuName: 'Thêm cấp dưới', menuType: 'F', alIcon: '', icon: '', path: '', code: 'default:system:dept:addlowlevel', orderNum: 4, status: true, newLinkFlag: false, visible: false },
  { id: 112, fatherId: 66, menuName: 'Tìm kiếm (bài viết)', menuType: 'C', alIcon: '', icon: 'table', path: '/default/page-demo/list/search-list/article', code: 'default:page-demo:list:search-list:article', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 113, fatherId: 66, menuName: 'Tìm kiếm (dự án)', menuType: 'C', alIcon: '', icon: 'table', path: '/default/page-demo/list/search-list/project', code: 'default:page-demo:list:search-list:project', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 114, fatherId: 66, menuName: 'Tìm kiếm (ứng dụng)', menuType: 'C', alIcon: '', icon: 'table', path: '/default/page-demo/list/search-list/application', code: 'default:page-demo:list:search-list:application', orderNum: 3, status: true, newLinkFlag: false, visible: true },
  { id: 115, fatherId: 95, menuName: 'Menu1-1-1', menuType: 'C', alIcon: '', icon: '', path: '/default/level/menu1/menu1-1/menu1-1-1', code: 'default:level:menu1:menu1-1:menu1-1-1', orderNum: 1, status: true, newLinkFlag: false, visible: true },
  { id: 116, fatherId: 95, menuName: 'Menu1-1-2', menuType: 'C', alIcon: '', icon: '', path: '/default/level/menu1/menu1-1/menu1-1-2', code: 'default:level:menu1:menu1-1:menu1-1-2', orderNum: 2, status: true, newLinkFlag: false, visible: true },
  { id: 117, fatherId: 3, menuName: 'Chuyển cảnh', menuType: 'C', alIcon: '', icon: 'logout', path: '/default/feat/transitions', code: 'default:feat:transitions', orderNum: 27, status: true, newLinkFlag: false, visible: true },
];

let nextId = 118;

export const menu = [
  http.post('/site/api/auth/menu', () => {
    return HttpResponse.json({ code: 200, msg: 'SUCCESS', data: menus });
  }),

  http.post('/site/api/menu/list', async ({ request }) => {
    const body = await request.json() as { pageIndex: number; pageSize: number; filters?: Partial<Menu> };
    const { pageIndex, pageSize, filters } = body;
    let list = [...menus];
    if (filters?.menuName) {
      list = list.filter(m => m.menuName.includes(filters.menuName!));
    }
    const total = list.length;
    // pageSize=0 means return all data
    if (pageSize === 0) {
      return HttpResponse.json({
        code: 200, msg: 'SUCCESS',
        data: { total, pageSize, pageIndex, list }
      });
    }
    const start = (pageIndex - 1) * pageSize;
    return HttpResponse.json({
      code: 200, msg: 'SUCCESS',
      data: { total, pageSize, pageIndex, list: list.slice(start, start + pageSize) }
    });
  }),

  http.get('/site/api/menu/:id', ({ params }) => {
    const item = menus.find(m => m.id === Number(params['id']));
    return HttpResponse.json({ code: 200, msg: 'SUCCESS', data: item ?? null });
  }),

  http.post('/site/api/menu/create', async ({ request }) => {
    const body = await request.json() as Omit<Menu, 'id'>;
    const newItem: Menu = { ...body, id: nextId++ };
    menus.push(newItem);
    return HttpResponse.json({ code: 200, msg: 'SUCCESS', data: null });
  }),

  http.put('/site/api/menu/update', async ({ request }) => {
    const body = await request.json() as Menu;
    const idx = menus.findIndex(m => m.id === body.id);
    if (idx !== -1) menus[idx] = { ...menus[idx], ...body };
    return HttpResponse.json({ code: 200, msg: 'SUCCESS', data: null });
  }),

  http.post('/site/api/menu/del', async ({ request }) => {
    const { ids } = await request.json() as { ids: number[] };
    menus = menus.filter(m => !ids.includes(m.id));
    return HttpResponse.json({ code: 200, msg: 'SUCCESS', data: null });
  }),
];
