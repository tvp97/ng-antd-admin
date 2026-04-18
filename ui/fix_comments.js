const fs = require('fs');
const path = require('path');

const replacements = {
  // .ts files
  'Để tập con của nút hiện tại được lưu vào bộ nhớ đệm, tiếp theoXóaKhông则会多余地输出子tậpdữ liệuexpandvìtruecùng cấp': 'Để tập con của nút hiện tại được lưu vào bộ nhớ đệm, nếu không sẽ xuất ra dư thừa các dữ liệu con có expand là true ở cùng cấp độ',
  'sử dụng `ApplicationRef` Đăng ký mới tạo实例 refBao gồm chế độ xem thành phần vào chu kỳ kiểm tra thay đổi.': 'sử dụng `ApplicationRef` để thêm component ref mới được tạo vào chu kỳ kiểm tra thay đổi.',

  // .less files
  '/* 滚动条整体样式 */': '/* Kiểu thanh cuộn tổng thể */',
  '/* 定义滚动条轨道 内阴影+圆角 */': '/* Định nghĩa đường ray thanh cuộn */',
  '/* 定义滑块 内阴影+圆角 */': '/* Định nghĩa thanh trượt */',
  '// 该主题zorro中没有这个变量，会报错': '// Theme này trong zorro không có biến này, sẽ báo lỗi',
  '// 如果存在所有主题通用的样式变量,基本样式文件并在每个主题样式定制文件中引入它：': '// Nếu có biến kiểu chung cho tất cả theme, hãy đưa vào đây:',
  '// 通用页面统一布局': '// Bố cục chung của trang',
  '/* 列表顶部样式 */': '/* Kiểu phần đầu danh sách */',
  '// 表单样式': '// Kiểu form',
  '/* 覆盖zorro样式 */': '/* Ghi đè kiểu zorro */',
  '// 对话框增加滚动条': '// Thêm thanh cuộn cho hộp thoại',
  '// zorro更新日志中16.2.2版本的中内置 cdk-overlay 样式影响，Xóa这段样式会导致Modal kéo thả的示例demo，同时弹出2个对话框，点击不同的对话框，z-index不生效': '// Fix lỗi z-index do cdk-overlay của zorro',
  '// 左侧导航栏宽度，如果修改请同步修改SideNavWidth的值': '// Chiều rộng sidebar, nếu sửa đổi hãy cập nhật SideNavWidth',
  '// 左侧导航栏宽度，如果修改请同步修改CollapsedNavWidth的值': '// Chiều rộng sidebar thu gọn, nếu sửa đổi hãy cập nhật CollapsedNavWidth',
  '// 阿里云主题官网，有点奇怪的样式': '// Theme Aliyun, kiểu hơi lạ',
  '/* 表格样式开始 */': '/* Bắt đầu kiểu bảng */',
  '/* 表格样式结束 */': '/* Kết thúc kiểu bảng */',
  '// 修正zorro样式问题': '// Fix lỗi style zorro',
  '// 顶部工具栏': '// Thanh công cụ trên cùng',
  '// 看板主体：三列横排': '// Thân bảng Kanban: 3 cột ngang',
  '// 列头卡片': '// Thẻ tiêu đề cột',
  '// 列内容区卡片': '// Thẻ khu vực nội dung cột',
  '// 列内容区（drop zone）': '// Khu vực nội dung cột (drop zone)',
  '// 空状态': '// Trạng thái trống',
  '// 任务卡片': '// Thẻ nhiệm vụ',
  '// 标题行': '// Dòng tiêu đề',
  '// 描述': '// Mô tả',
  '// 底部标签': '// Thẻ dưới cùng',
  '// 拖拽占位': '// Chỗ dành cho kéo thả',
  '// 拖拽预览': '// Xem trước kéo thả',
  '// 固定页签模式下，移除tab的底部边框，底部会有2条线重合': '// Xóa viền dưới tab ở chế độ cố định để tránh trùng lặp 2 đường viền',
  '/* 滚动条里面小方块 */': '/* Khối nhỏ trong thanh cuộn */'
};

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.less')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const [key, value] of Object.entries(replacements)) {
        if (content.includes(key)) {
            content = content.split(key).join(value);
        }
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }
});

console.log(`Updated ${updatedCount} files.`);
