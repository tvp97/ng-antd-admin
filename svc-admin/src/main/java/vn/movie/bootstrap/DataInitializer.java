package vn.movie.bootstrap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.movie.entity.*;
import vn.movie.repository.*;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private MenuRepository menuRepository;
    @Autowired private SysUserRoleRepository sysUserRoleRepository;
    @Autowired private SysRolePermRepository sysRolePermRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (departmentRepository.count() == 0) {
            System.out.println("Initializing fake data from ng-antd-admin mocks...");
            
            // 1. Departments
            departmentRepository.save(createDept(1, 0, "Công ty Ant", 0, true));
            departmentRepository.save(createDept(2, 1, "Trụ sở Nam Kinh", 0, true));
            departmentRepository.save(createDept(3, 1, "Chi nhánh Thượng Hải", 0, true));
            departmentRepository.save(createDept(4, 2, "Phòng R&D", 0, true));
            departmentRepository.save(createDept(5, 2, "Phòng kiểm thử", 1, true));
            departmentRepository.save(createDept(6, 3, "Phòng thị trường", 0, true));
            departmentRepository.save(createDept(7, 3, "Phòng marketing", 1, true));

            // 2. Roles
            roleRepository.save(createRole(1, "Quản trị viên", "Toàn quyền"));
            roleRepository.save(createRole(2, "Lập trình viên", "Quyền hạn chế"));

            // 3. Users
            userRepository.save(createUser(1, "admin", "287643967@qq.com", passwordEncoder.encode("123456"), 4, true, 1, "13131313131", "02884449802"));
            userRepository.save(createUser(2, "user_demo", "287643967@qq.com", passwordEncoder.encode("123456"), 5, true, 1, "13131313131", "02884449802"));

            // 4. User Roles
            sysUserRoleRepository.save(createUserRole(1, 1));
            sysUserRoleRepository.save(createUserRole(2, 2));

            // 5. Menus
            menuRepository.save(createMenu(1, 0, "Bảng điều khiển", "C", "", "dashboard", "/default/dashboard", "default:dashboard", 1, true, false, true));
            menuRepository.save(createMenu(2, 0, "Trang", "C", "", "appstore", "/default/page-demo", "default:page-demo", 2, true, false, true));
            menuRepository.save(createMenu(3, 0, "Tính năng", "C", "", "star", "/default/feat", "default:feat", 3, true, false, true));
            menuRepository.save(createMenu(4, 0, "Thành phần", "C", "", "star", "/default/comp", "default:comp", 4, true, false, true));
            menuRepository.save(createMenu(5, 0, "Menu đa cấp", "C", "", "menu", "/default/level", "default:level", 5, true, false, true));
            menuRepository.save(createMenu(6, 0, "Quản trị hệ thống", "C", "", "menu", "/default/system", "default:system", 6, true, false, true));
            menuRepository.save(createMenu(7, 0, "Giới thiệu", "C", "", "apple", "/default/about", "default:about", 7, true, false, true));
            menuRepository.save(createMenu(8, 1, "Phân tích", "C", "", "fund", "/default/dashboard/analysis", "default:dashboard:analysis", 1, true, false, true));
            menuRepository.save(createMenu(9, 1, "Giám sát", "C", "", "fund", "/default/dashboard/monitor", "default:dashboard:monitor", 2, true, false, true));
            menuRepository.save(createMenu(10, 1, "Bàn làm việc", "C", "", "appstore", "/default/dashboard/workbench", "default:dashboard:workbench", 3, true, false, true));
            menuRepository.save(createMenu(11, 2, "Biểu mẫu", "C", "", "form", "/default/page-demo/form", "default:page-demo:form", 1, true, false, true));
            menuRepository.save(createMenu(12, 2, "Danh sách", "C", "", "table", "/default/page-demo/list", "default:page-demo:list", 2, true, false, true));
            menuRepository.save(createMenu(13, 2, "Chi tiết", "C", "", "profile", "/default/page-demo/detail", "default:page-demo:detail", 3, true, false, true));
            menuRepository.save(createMenu(14, 2, "Kết quả", "C", "", "check-circle", "/default/page-demo/result", "default:page-demo:result", 4, true, false, true));
            menuRepository.save(createMenu(15, 2, "Lỗi / ngoại lệ", "C", "", "warning", "/default/page-demo/except", "default:page-demo:except", 5, true, false, true));
            menuRepository.save(createMenu(16, 2, "Cá nhân", "C", "", "user", "/default/page-demo/personal", "default:page-demo:personal", 6, true, false, true));
            menuRepository.save(createMenu(17, 2, "Sơ đồ / flow", "C", "icon-mel-help", "", "/default/page-demo/flow", "default:page-demo:flow", 7, true, false, true));
            menuRepository.save(createMenu(18, 2, "Nhiệm vụ", "C", "", "border-bottom", "/default/page-demo/task", "default:page-demo:task", 8, true, false, true));
            menuRepository.save(createMenu(19, 2, "Bố cục mới", "C", "", "caret-down", "/default/page-demo/page-demo1", "default:page-demo:page-demo1", 9, true, false, true));
            menuRepository.save(createMenu(20, 2, "Trang mới 2", "C", "", "up", "/default/page-demo/page-demo2", "default:page-demo:page-demo2", 10, true, false, true));
            menuRepository.save(createMenu(21, 2, "Trang mới 3", "C", "", "down", "/default/page-demo/page-demo3", "default:page-demo:page-demo3", 11, true, false, true));
            menuRepository.save(createMenu(22, 2, "Trang mới 4", "C", "", "caret-down", "/default/page-demo/page-demo4", "default:page-demo:page-demo4", 12, true, false, true));
            menuRepository.save(createMenu(23, 3, "Thông báo", "C", "", "dashboard", "/default/feat/msg", "default:feat:msg", 1, true, false, true));
            menuRepository.save(createMenu(24, 3, "Biểu tượng", "C", "", "dashboard", "/default/feat/icons", "default:feat:icons", 2, true, false, true));
            menuRepository.save(createMenu(25, 3, "Menu chuột phải", "C", "", "dashboard", "/default/feat/context-menu", "default:feat:context-menu", 3, true, false, true));
            menuRepository.save(createMenu(26, 3, "Xem trước ảnh", "C", "", "dashboard", "/default/feat/img-preview", "default:feat:img-preview", 4, true, false, true));
            menuRepository.save(createMenu(27, 3, "Toàn màn hình", "C", "", "dashboard", "/default/feat/full-screen", "default:feat:full-screen", 5, true, false, true));
            menuRepository.save(createMenu(28, 3, "Thao tác tab", "C", "", "dashboard", "/default/feat/tabs", "default:feat:tabs", 6, true, false, true));
            menuRepository.save(createMenu(29, 3, "Modal kéo thả", "C", "", "dashboard", "/default/feat/ex-modal", "default:feat:ex-modal", 7, true, false, true));
            menuRepository.save(createMenu(30, 3, "Drawer bọc", "C", "", "dashboard", "/default/feat/ex-drawer", "default:feat:ex-drawer", 8, true, false, true));
            menuRepository.save(createMenu(31, 3, "Văn bản định dạng", "C", "", "dashboard", "/default/feat/rich-text", "default:feat:rich-text", 9, true, false, true));
            menuRepository.save(createMenu(32, 3, "clickOutSide", "C", "", "dashboard", "/default/feat/click-out-side", "default:feat:click-out-side", 10, true, false, true));
            menuRepository.save(createMenu(33, 3, "Tài liệu ngoài", "C", "", "dashboard", "/default/feat/frame", "default:feat:frame", 11, true, false, true));
            menuRepository.save(createMenu(34, 3, "Thanh cuộn", "C", "", "dashboard", "/default/feat/scroll", "default:feat:scroll", 12, true, false, true));
            menuRepository.save(createMenu(35, 3, "Biểu đồ", "C", "", "dashboard", "/default/feat/charts", "default:feat:charts", 13, true, false, true));
            menuRepository.save(createMenu(36, 3, "Đăng nhập khác", "C", "", "dashboard", "/blank/other-login", "blank:other-login", 14, true, false, true));
            menuRepository.save(createMenu(37, 3, "Chọn màu", "C", "", "usergroup-delete", "/default/feat/color-sel", "default:feat:color-sel", 15, true, false, true));
            menuRepository.save(createMenu(38, 3, "Hiệu ứng gợn sóng", "C", "", "usergroup-delete", "/default/feat/ripple", "default:feat:ripple", 16, true, false, true));
            menuRepository.save(createMenu(39, 3, "Bảng tạm", "C", "", "usergroup-delete", "/default/feat/copy", "default:feat:copy", 17, true, false, true));
            menuRepository.save(createMenu(40, 3, "Trang trống", "C", "", "usergroup-delete", "/blank/empty-page", "blank:empty-page", 18, true, false, true));
            menuRepository.save(createMenu(41, 3, "Hướng dẫn (tour)", "C", "", "codepen", "/default/feat/setup", "default:feat:setup", 19, true, false, true));
            menuRepository.save(createMenu(42, 3, "Hết phiên đăng nhập", "C", "", "yuque", "/default/feat/session-timeout", "default:feat:session-timeout", 20, true, false, true));
            menuRepository.save(createMenu(43, 3, "websocket", "C", "", "border-horizontal", "/default/feat/websocket", "default:feat:websocket", 21, true, false, true));
            menuRepository.save(createMenu(44, 3, "Tải xuống tệp", "C", "", "arrow-down", "/default/feat/download", "default:feat:download", 23, true, false, true));
            menuRepository.save(createMenu(45, 3, "Tải lên tệp", "C", "", "up", "/default/feat/upload", "default:feat:upload", 22, true, false, true));
            menuRepository.save(createMenu(46, 3, "Mã QR", "C", "", "gitlab", "/default/feat/qrcode", "default:feat:qrcode", 24, true, false, true));
            menuRepository.save(createMenu(47, 3, "Watermark", "C", "", "windows", "/default/feat/water-mark", "default:feat:water-mark", 25, true, false, true));
            menuRepository.save(createMenu(48, 3, "KeepAlive", "C", "", "border-horizontal", "/default/feat/keep-alive", "default:feat:keep-alive", 26, true, false, true));
            menuRepository.save(createMenu(49, 4, "Thành phần cơ bản", "C", "", "dashboard", "/default/comp/basic", "default:comp:basic", 1, true, false, true));
            menuRepository.save(createMenu(50, 4, "Hoạt ảnh", "C", "", "dashboard", "/default/comp/transition", "default:comp:transition", 2, true, false, true));
            menuRepository.save(createMenu(51, 4, "Excel trực tuyến", "C", "", "dashboard", "/default/comp/luckysheet", "default:comp:luckysheet", 3, true, false, true));
            menuRepository.save(createMenu(52, 4, "Lazy load", "C", "", "dashboard", "/default/comp/lazy", "default:comp:lazy", 4, true, false, true));
            menuRepository.save(createMenu(53, 4, "Mô tả chi tiết", "C", "", "dashboard", "/default/comp/desc", "default:comp:desc", 5, true, false, true));
            menuRepository.save(createMenu(54, 4, "Độ mạnh mật khẩu", "C", "", "dashboard", "/default/comp/strength-meter", "default:comp:strength-meter", 6, true, false, true));
            menuRepository.save(createMenu(55, 4, "Form", "C", "", "form", "/default/comp/form", "default:comp:form", 7, true, false, true));
            menuRepository.save(createMenu(56, 4, "blingbling", "C", "", "caret-down", "/default/comp/blingbling", "default:comp:blingbling", 8, true, false, true));
            menuRepository.save(createMenu(57, 5, "Menu1", "C", "", "menu", "/default/level/menu1", "default:level:menu1", 1, true, false, true));
            menuRepository.save(createMenu(58, 5, "Menu2", "C", "", "menu", "/default/level/menu2", "default:level:menu2", 2, true, false, true));
            menuRepository.save(createMenu(59, 6, "Tài khoản", "C", "", "menu", "/default/system/account", "default:system:account", 1, true, false, true));
            menuRepository.save(createMenu(60, 6, "Vai trò", "C", "icon-mel-help", "", "/default/system/role-manager", "default:system:role-manager", 2, true, false, true));
            menuRepository.save(createMenu(61, 6, "Menu", "C", "", "menu", "/default/system/menu", "default:system:menu", 3, true, false, true));
            menuRepository.save(createMenu(62, 6, "Phòng ban", "C", "icon-mel-help", "", "/default/system/dept", "default:system:dept", 4, true, false, true));
            menuRepository.save(createMenu(63, 11, "Biểu mẫu cơ bản", "C", "", "form", "/default/page-demo/form/base-form", "default:page-demo:form:base-form", 1, true, false, true));
            menuRepository.save(createMenu(64, 11, "Biểu mẫu nhiều bước", "C", "", "form", "/default/page-demo/form/step-form", "default:page-demo:form:step-form", 2, true, false, true));
            menuRepository.save(createMenu(65, 11, "Biểu mẫu nâng cao", "C", "", "form", "/default/page-demo/form/advanced-form", "default:page-demo:form:advanced-form", 3, true, false, true));
            menuRepository.save(createMenu(66, 12, "Danh sách tìm kiếm", "C", "", "", "/default/page-demo/list/search-list", "default:page-demo:list:search-list", 1, true, false, true));
            menuRepository.save(createMenu(67, 12, "Bảng tra cứu", "C", "", "table", "/default/page-demo/list/search-table", "default:page-demo:list:search-table", 2, true, false, true));
            menuRepository.save(createMenu(68, 12, "Bảng cây", "C", "", "table", "/default/page-demo/list/tree-list", "default:page-demo:list:tree-list", 3, true, false, true));
            menuRepository.save(createMenu(69, 12, "Bảng chuẩn", "C", "", "table", "/default/page-demo/list/standard-table", "default:page-demo:list:standard-table", 4, true, false, true));
            menuRepository.save(createMenu(70, 12, "Danh sách thẻ", "C", "", "table", "/default/page-demo/list/card-table", "default:page-demo:list:card-table", 5, true, false, true));
            menuRepository.save(createMenu(71, 13, "Chi tiết cơ bản", "C", "", "profile", "/default/page-demo/detail/base-detail", "default:page-demo:detail:base-detail", 1, true, false, true));
            menuRepository.save(createMenu(72, 13, "Chi tiết nâng cao", "C", "", "profile", "/default/page-demo/detail/adv-detail", "default:page-demo:detail:adv-detail", 2, true, false, true));
            menuRepository.save(createMenu(73, 14, "Thành công", "C", "", "check-circle", "/default/page-demo/result/success", "default:page-demo:result:success", 1, true, false, true));
            menuRepository.save(createMenu(74, 14, "Thất bại", "C", "", "check-circle", "/default/page-demo/result/fail", "default:page-demo:result:fail", 2, true, false, true));
            menuRepository.save(createMenu(75, 15, "403", "C", "", "warning", "/default/page-demo/except/except403", "default:page-demo:except:except403", 1, true, false, true));
            menuRepository.save(createMenu(76, 15, "404", "C", "", "warning", "/default/page-demo/except/except404", "default:page-demo:except:except404", 2, true, false, true));
            menuRepository.save(createMenu(77, 15, "500", "C", "", "warning", "/default/page-demo/except/except500", "default:page-demo:except:except500", 3, true, false, true));
            menuRepository.save(createMenu(78, 15, "Lỗi mạng", "C", "", "warning", "/default/page-demo/except/network-error", "default:page-demo:except:network-error", 4, true, false, true));
            menuRepository.save(createMenu(79, 15, "Không có dữ liệu", "C", "", "warning", "/default/page-demo/except/no-data", "default:page-demo:except:no-data", 5, true, false, true));
            menuRepository.save(createMenu(80, 16, "Trung tâm cá nhân", "C", "", "user", "/default/page-demo/personal/personal-center", "default:page-demo:personal:personal-center", 1, true, false, true));
            menuRepository.save(createMenu(81, 16, "Cài đặt cá nhân", "C", "", "user", "/default/page-demo/personal/personal-setting", "default:page-demo:personal:personal-setting", 2, true, false, true));
            menuRepository.save(createMenu(82, 17, "Sơ đồ chat", "C", "", "highlight", "/default/page-demo/flow/flow-chat", "default:page-demo:flow:flow-chat", 1, true, false, true));
            menuRepository.save(createMenu(83, 33, "Tài liệu Zorro", "C", "", "dashboard", "/default/feat/frame/zorro-doc", "default:feat:frame:zorro-doc", 1, true, false, true));
            menuRepository.save(createMenu(84, 33, "Liên kết ngoài", "C", "", "usergroup-delete", "https://github.com/huajian123/ng-antd-admin", "https://github.com/huajian123/ng-antd-admin", 2, true, true, true));
            menuRepository.save(createMenu(85, 34, "Cuộn có bộ nhớ đệm", "C", "", "dashboard", "/default/feat/scroll/keep-scroll-page", "default:feat:scroll:keep-scroll-page", 1, true, false, true));
            menuRepository.save(createMenu(86, 34, "Demo thanh cuộn", "C", "", "dashboard", "/default/feat/scroll/play-scroll", "default:feat:scroll:play-scroll", 2, true, false, true));
            menuRepository.save(createMenu(87, 35, "Amap (Gaode)", "C", "", "highlight", "/default/feat/charts/gaode-map", "default:feat:charts:gaode-map", 1, true, false, true));
            menuRepository.save(createMenu(88, 35, "Baidu", "C", "", "highlight", "/default/feat/charts/baidu-map", "default:feat:charts:baidu-map", 2, true, false, true));
            menuRepository.save(createMenu(89, 35, "Echarts", "C", "", "highlight", "/default/feat/charts/echarts", "default:feat:charts:echarts", 3, true, false, true));
            menuRepository.save(createMenu(90, 36, "Kiểu 1", "C", "", "highlight", "/blank/other-login/login1", "blank:other-login:login1", 1, true, false, true));
            menuRepository.save(createMenu(91, 52, "Lazy load cơ bản", "C", "", "dashboard", "/default/comp/lazy/lazy-basic", "default:comp:lazy:lazy-basic", 1, true, false, true));
            menuRepository.save(createMenu(92, 52, "Lazy load khi cuộn", "C", "", "dashboard", "/default/comp/lazy/lazy-scroll", "default:comp:lazy:lazy-scroll", 2, true, false, true));
            menuRepository.save(createMenu(93, 55, "Form thu gọn", "C", "", "minus-square", "/default/comp/form/shrink-form", "default:comp:form:shrink-form", 1, true, false, true));
            menuRepository.save(createMenu(94, 55, "Thêm/xóa dòng form", "C", "", "chrome", "/default/comp/form/append-form", "default:comp:form:append-form", 2, true, false, true));
            menuRepository.save(createMenu(95, 57, "Menu1-1", "C", "", "", "/default/level/menu1/menu1-1", "default:level:menu1:menu1-1", 1, true, false, true));
            menuRepository.save(createMenu(96, 57, "Menu1-2", "C", "", "menu", "/default/level/menu1/menu1-2", "default:level:menu1:menu1-2", 2, true, false, true));
            menuRepository.save(createMenu(97, 59, "Thêm tài khoản", "F", "", "", "", "default:system:account:add", 1, true, false, false));
            menuRepository.save(createMenu(98, 59, "Sửa tài khoản", "F", "", "", "", "default:system:account:edit", 2, true, false, false));
            menuRepository.save(createMenu(99, 59, "Xóa tài khoản", "F", "", "", "", "default:system:account:del", 3, true, false, false));
            menuRepository.save(createMenu(100, 60, "Thêm vai trò", "F", "", "", "", "default:system:role-manager:add", 1, true, false, false));
            menuRepository.save(createMenu(101, 60, "Sửa vai trò", "F", "", "", "", "default:system:role-manager:edit", 2, true, false, false));
            menuRepository.save(createMenu(102, 60, "Xóa vai trò", "F", "", "", "", "default:system:role-manager:del", 3, true, false, false));
            menuRepository.save(createMenu(103, 60, "Gán quyền vai trò", "F", "", "", "", "default:system:role-manager:set-role", 4, true, false, false));
            menuRepository.save(createMenu(104, 61, "Thêm menu", "F", "", "", "", "default:system:menu:add", 1, true, false, true));
            menuRepository.save(createMenu(105, 61, "Sửa menu", "F", "", "", "", "default:system:menu:edit", 2, true, false, false));
            menuRepository.save(createMenu(106, 61, "Xóa menu", "F", "", "", "", "default:system:menu:del", 3, true, false, false));
            menuRepository.save(createMenu(107, 61, "Thêm menu con", "F", "", "", "", "default:system:menu:addlowlevel", 4, true, false, false));
            menuRepository.save(createMenu(108, 62, "Thêm phòng ban", "F", "", "", "", "default:system:dept:add", 1, true, false, false));
            menuRepository.save(createMenu(109, 62, "Sửa phòng ban", "F", "", "", "", "default:system:dept:edit", 2, true, false, false));
            menuRepository.save(createMenu(110, 62, "Xóa phòng ban", "F", "", "", "", "default:system:dept:del", 3, true, false, false));
            menuRepository.save(createMenu(111, 62, "Thêm cấp dưới", "F", "", "", "", "default:system:dept:addlowlevel", 4, true, false, false));
            menuRepository.save(createMenu(112, 66, "Tìm kiếm (bài viết)", "C", "", "table", "/default/page-demo/list/search-list/article", "default:page-demo:list:search-list:article", 1, true, false, true));
            menuRepository.save(createMenu(113, 66, "Tìm kiếm (dự án)", "C", "", "table", "/default/page-demo/list/search-list/project", "default:page-demo:list:search-list:project", 2, true, false, true));
            menuRepository.save(createMenu(114, 66, "Tìm kiếm (ứng dụng)", "C", "", "table", "/default/page-demo/list/search-list/application", "default:page-demo:list:search-list:application", 3, true, false, true));
            menuRepository.save(createMenu(115, 95, "Menu1-1-1", "C", "", "", "/default/level/menu1/menu1-1/menu1-1-1", "default:level:menu1:menu1-1:menu1-1-1", 1, true, false, true));
            menuRepository.save(createMenu(116, 95, "Menu1-1-2", "C", "", "", "/default/level/menu1/menu1-1/menu1-1-2", "default:level:menu1:menu1-1:menu1-1-2", 2, true, false, true));
            menuRepository.save(createMenu(117, 3, "Chuyển cảnh", "C", "", "logout", "/default/feat/transitions", "default:feat:transitions", 27, true, false, true));

            // 6. Role Perms (Admin Role 1 gets all)
            List<String> adminCodes = List.of(
                "default:dashboard",
                "default:dashboard:analysis",
                "default:dashboard:monitor",
                "default:dashboard:workbench",
                "default:page-demo",
                "default:page-demo:form",
                "default:page-demo:form:base-form",
                "default:page-demo:form:step-form",
                "default:page-demo:form:advanced-form",
                "default:page-demo:list",
                "default:page-demo:list:search-list",
                "default:page-demo:list:search-list:article",
                "default:page-demo:list:search-list:project",
                "default:page-demo:list:search-list:application",
                "default:page-demo:list:search-table",
                "default:page-demo:list:tree-list",
                "default:page-demo:list:standard-table",
                "default:page-demo:list:card-table",
                "default:page-demo:detail",
                "default:page-demo:detail:base-detail",
                "default:page-demo:detail:adv-detail",
                "default:page-demo:result",
                "default:page-demo:result:success",
                "default:page-demo:result:fail",
                "default:page-demo:except",
                "default:page-demo:except:except403",
                "default:page-demo:except:except404",
                "default:page-demo:except:except500",
                "default:page-demo:except:network-error",
                "default:page-demo:except:no-data",
                "default:page-demo:personal",
                "default:page-demo:personal:personal-center",
                "default:page-demo:personal:personal-setting",
                "default:page-demo:flow",
                "default:page-demo:flow:flow-chat",
                "default:page-demo:task",
                "default:page-demo:page-demo1",
                "default:page-demo:page-demo2",
                "default:page-demo:page-demo3",
                "default:page-demo:page-demo4",
                "default:feat",
                "default:feat:msg",
                "default:feat:icons",
                "default:feat:context-menu",
                "default:feat:img-preview",
                "default:feat:full-screen",
                "default:feat:tabs",
                "default:feat:ex-modal",
                "default:feat:ex-drawer",
                "default:feat:rich-text",
                "default:feat:click-out-side",
                "default:feat:frame",
                "default:feat:frame:zorro-doc",
                "https://github.com/huajian123/ng-antd-admin",
                "default:feat:scroll",
                "default:feat:scroll:keep-scroll-page",
                "default:feat:scroll:play-scroll",
                "default:feat:charts",
                "default:feat:charts:gaode-map",
                "default:feat:charts:baidu-map",
                "default:feat:charts:echarts",
                "blank:other-login",
                "blank:other-login:login1",
                "default:feat:color-sel",
                "default:feat:ripple",
                "default:feat:copy",
                "blank:empty-page",
                "default:feat:setup",
                "default:feat:session-timeout",
                "default:feat:websocket",
                "default:feat:upload",
                "default:feat:download",
                "default:feat:qrcode",
                "default:feat:water-mark",
                "default:feat:keep-alive",
                "default:feat:transitions",
                "default:comp",
                "default:comp:basic",
                "default:comp:transition",
                "default:comp:luckysheet",
                "default:comp:lazy",
                "default:comp:lazy:lazy-basic",
                "default:comp:lazy:lazy-scroll",
                "default:comp:desc",
                "default:comp:strength-meter",
                "default:comp:form",
                "default:comp:form:shrink-form",
                "default:comp:form:append-form",
                "default:comp:blingbling",
                "default:level",
                "default:level:menu1",
                "default:level:menu1:menu1-1",
                "default:level:menu1:menu1-1:menu1-1-1",
                "default:level:menu1:menu1-1:menu1-1-2",
                "default:level:menu1:menu1-2",
                "default:level:menu2",
                "default:system",
                "default:system:account",
                "default:system:account:add",
                "default:system:account:edit",
                "default:system:account:del",
                "default:system:role-manager",
                "default:system:role-manager:add",
                "default:system:role-manager:edit",
                "default:system:role-manager:del",
                "default:system:role-manager:set-role",
                "default:system:menu",
                "default:system:menu:add",
                "default:system:menu:edit",
                "default:system:menu:del",
                "default:system:menu:addlowlevel",
                "default:system:dept",
                "default:system:dept:add",
                "default:system:dept:edit",
                "default:system:dept:del",
                "default:system:dept:addlowlevel",
                "default:about"
            );
            for (String code : adminCodes) {
                sysRolePermRepository.save(createRolePerm(1, code));
            }
            // Dev Role 2 gets basic
            sysRolePermRepository.save(createRolePerm(2, "default:dashboard"));
            sysRolePermRepository.save(createRolePerm(2, "default:dashboard:analysis"));

            System.out.println("Fake data initialization complete.");
        }
    }

    private Department createDept(Integer id, Integer fatherId, String name, Integer orderNum, Boolean state) {
        Department d = new Department();
        // Since we specify ID, we may need to make sure sequence is updated, or just rely on JPA to insert it. 
        // With GeneratedValue(IDENTITY), setting ID manually is ignored by some JPA providers.
        // It's better to just let it save without setting ID and assume the order they are inserted matches the IDs 1, 2, 3...
        // Because of relations, we need to map old IDs to new entities if IDs don't match, 
        // but since DB is empty, IDs will be generated exactly as 1, 2, 3...
        // We will just not set ID and assume it increments sequentially.
        d.setFatherId(fatherId);
        d.setDepartmentName(name);
        d.setOrderNum(orderNum);
        d.setState(state);
        return d;
    }

    private Role createRole(Integer id, String name, String desc) {
        Role r = new Role();
        r.setRoleName(name);
        r.setRoleDesc(desc);
        return r;
    }

    private User createUser(Integer id, String username, String email, String pass, Integer deptId, Boolean available, Integer sex, String mobile, String phone) {
        User u = new User();
        u.setUserName(username);
        u.setEmail(email);
        u.setPassword(pass);
        u.setDepartmentId(deptId);
        u.setAvailable(available);
        u.setSex(sex);
        u.setMobile(mobile);
        u.setTelephone(phone);
        return u;
    }

    private SysUserRole createUserRole(Integer userId, Integer roleId) {
        SysUserRole sur = new SysUserRole();
        sur.setUserId(userId);
        sur.setRoleId(roleId);
        return sur;
    }

    private Menu createMenu(Integer id, Integer fatherId, String name, String type, String alIcon, String icon, String path, String code, Integer order, Boolean status, Boolean newLinkFlag, Boolean visible) {
        Menu m = new Menu();
        m.setFatherId(fatherId);
        m.setMenuName(name);
        m.setMenuType(type);
        m.setAlIcon(alIcon);
        m.setIcon(icon);
        m.setPath(path);
        m.setCode(code);
        m.setOrderNum(order);
        m.setStatus(status);
        m.setNewLinkFlag(newLinkFlag);
        m.setVisible(visible);
        return m;
    }

    private SysRolePerm createRolePerm(Integer roleId, String code) {
        SysRolePerm srp = new SysRolePerm();
        srp.setRoleId(roleId);
        srp.setPermCode(code);
        return srp;
    }
}
