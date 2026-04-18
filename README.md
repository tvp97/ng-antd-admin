<div align="center">

# 🚀 ng-antd-admin

**Giải pháp frontend admin doanh nghiệp dựa trên Angular 21**

[![CodeFactor](https://www.codefactor.io/repository/github/huajian123/ng-antd-admin/badge)](https://www.codefactor.io/repository/github/huajian123/ng-antd-admin)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
[![Angular](https://img.shields.io/badge/Build%20with-Angular%2021-red?logo=angular)](https://www.github.com/angular/angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![ng-zorro](https://img.shields.io/badge/ng--zorro--antd-21-blue?logo=ant-design)

[Xem trực tuyến](https://huajian123.github.io/ng-antd-admin/) · [Demo tính năng](https://www.bilibili.com/video/BV1gF411x7rN/) · [Phản hồi vấn đề](https://github.com/huajian123/ng-antd-admin/issues) · [Nhật ký cập nhật](https://github.com/huajian123/ng-antd-admin/releases)

<img src="https://github.com/huajian123/ng-antd-admin/blob/master/ui/projectImg/11.png?raw=true" alt="Ảnh chụp màn hình hệ thống" width="800"/>
</div>

---

## 📖 Giới thiệu dự án

**ng-antd-admin** là một giải pháp frontend admin doanh nghiệp **sẵn sàng production**, được xây dựng trên **Angular 21** và **ng-zorro-antd 21**.

Dự án bám sát tiến hóa công nghệ Angular, tận dụng tối đa các tính năng mới nhất, gồm **Standalone Components**, **Zoneless Change Detection**, **Signals API** và **View Transitions**, nhằm cung cấp cho lập trình viên một template hiện đại, hiệu năng cao và dễ bảo trì.

### 💡 Vì sao chọn ng-antd-admin?

- ✅ **Công nghệ tiên tiến**: Tiên phong hệ sinh thái Angular 21 (Signals, Zoneless, Control Flow).
- ✅ **Hiệu năng tốt**: Chiến lược OnPush toàn ứng dụng + tái sử dụng route thông minh + lazy load, trải nghiệm gần với ứng dụng native.
- ✅ **Dùng được ngay**: Tích hợp sẵn RBAC, đổi theme, quản lý nhiều tab và các tính năng lõi khác.
- ✅ **Chuẩn code**: ESLint + TypeScript + Prettier chặt chẽ, đảm bảo chất lượng mã nguồn.
- ✅ **Thân thiện học tập**: Chú thích đầy đủ — không chỉ là boilerplate mà còn là thực hành tốt với Angular hiện đại.
- ✅ **Duy trì lâu dài**: Cam kết cập nhật theo phiên bản chính thức của Angular.

---

## ✨ Tính năng cốt lõi

### 🎯 Tổng quan stack

| Công nghệ | Phiên bản | Mô tả |
|------|------|------|
| **Angular** | 21.0.3 | Framework lõi, kiến trúc Standalone toàn diện |
| **TypeScript** | 5.9.3 | Ngôn ngữ phát triển, bật chế độ strict |
| **ng-zorro-antd** | 21.0.0 | Thư viện UI doanh nghiệp (Ant Design) |
| **RxJS** | 7.8.0 | Thư viện lập trình phản ứng |
| **Less** | 4.2.0 | CSS preprocessor |
| **NestJS** | 10.x | (Tuỳ chọn) Framework backend |

### 🚀 Chi tiết tính năng tiên tiến

#### 1️⃣ Standalone Components — không cần NgModule
Loại bỏ `NgModule` rườm rà, phụ thuộc component rõ ràng hơn.
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './example.component.html'
})
export class ExampleComponent {}
```

#### 2️⃣ Zoneless Change Detection — hiệu năng vượt trội
Bỏ phụ thuộc `zone.js`, hiệu năng change detection cải thiện hơn 30%.
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection()
  ]
};
```

#### 3️⃣ Signals API — phản ứng chi tiết
Dùng Signals thay một phần luồng RxJS, quản lý trạng thái trực quan hơn.
```typescript
export class ThemeService {
  $isNightTheme = signal(false);
  $themesOptions = signal<SettingInterface>({ ...defaultOptions });
  
  toggleTheme() {
    this.$isNightTheme.update(v => !v);
  }
}
```

#### 4️⃣ Tái sử dụng route thông minh (Keep-Alive)
Cơ chế cache route tương tự `keep-alive` của Vue, hỗ trợ nhớ vị trí cuộn.
```typescript
// Cấu hình route
data: { 
  key: 'user-list',           // Khóa duy nhất cho cache
  scrollContain: ['#table']   // Tự khôi phục vị trí thanh cuộn
}
```

#### 5️⃣ View Transitions API
Chuyển cảnh giữa các route mức native, mượt mà.
```typescript
provideRouter(routes, withViewTransitions({ skipInitialTransition: true }))
```

---

## 🏗️ Kiến trúc và chức năng

### Kiến trúc frontend
- **Thiết kế module hoá**: Cấu trúc thư mục rõ ràng (`core` lõi, `shared` dùng chung, `pages` trang, `widget` tiện ích).
- **Dependency injection**: Dùng `inject()` toàn bộ, code gọn hơn.
- **Hiệu năng tối đa**: Chiến lược OnPush toàn cục + chiến lược preload tuỳ chỉnh.

### Chức năng UI
- 🌈 **Đa theme**: Mặc định, tối, Alibaba Cloud, gọn — đổi một cú nhấp.
- 🔖 **Nhiều tab**: Menu chuột phải, kéo thả sắp xếp, trải nghiệm kiểu trình duyệt.
- 📱 **Responsive**: Tương thích PC, tablet, điện thoại.
- 🔒 **Bảo mật**: Khóa màn hình, phân quyền đến mức nút bấm.

### Tích hợp backend (tuỳ chọn)
Cung cấp backend đầy đủ dựa trên **NestJS + PostgreSQL + Drizzle ORM**:
- **Mô hình RBAC**: Kiểm soát chi tiết người dùng – vai trò – menu – quyền.
- **JWT**: Luồng xác thực token chuẩn.
- **Module đầy đủ**: Quản lý người dùng, phòng ban, menu và các API nghiệp vụ cơ bản.

---

## 📦 Bắt đầu nhanh

### Cách 1: Chỉ xem frontend (khuyến nghị để trải nghiệm)
Dùng MSW (Mock Service Worker) mô phỏng dữ liệu, không cần chạy backend vẫn dùng đủ tính năng.

```bash
# 1. Clone nhánh mock
git clone -b mock https://github.com/huajian123/ng-antd-admin.git

# 2. Vào thư mục frontend
cd ng-antd-admin/ui

# 3. Cài dependency
npm install

# 4. Chạy dự án
npm start

# 5. Truy cập http://localhost:4201
```

> Cũng có thể xem trực tuyến: [https://huajian123.github.io/ng-antd-admin/](https://huajian123.github.io/ng-antd-admin/)

### Cách 2: Full-stack (frontend + backend)
Phù hợp khi cần phát triển tiếp hệ thống nghiệp vụ hoàn chỉnh.

#### 1. Chạy backend (NestJS)
```bash
# 1. Đảm bảo đã cài Docker
docker --version

# 2. Vào thư mục backend
cd nest-api

# 3. Khởi động container PostgreSQL
docker-compose up -d

# 4. Import database
# Kết nối bằng DataGrip/Navicat v.v.
# Host: localhost / User: admin / Mật khẩu: 123456
# Database: ng-antd-admin-db
# Chạy file: nest-api/ng-antd-admin-db.sql

# 5. Cài dependency và chạy
npm install
npm run start
```

#### 2. Chạy frontend
```bash
# 1. Vào thư mục frontend
cd ui

# 2. Cài dependency
npm install

# 3. Chạy dev server
npm start

# 4. Mở trình duyệt http://localhost:4201
```

### Cách 3: Bản “sạch” (không code nghiệp vụ)
Chỉ giữ khung kiến trúc, phù hợp khi nối API backend có sẵn.

```html
https://gitee.com/hjxiaoqianduan/ng-ant-admin-pure
```

---

## 📚 Hướng dẫn phát triển cốt lõi

### 1. Cấu hình tái sử dụng route
Điều khiển hành vi cache qua thuộc tính `data` trong định nghĩa route:

```typescript
const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
    data: { 
      key: 'list-page',         // Bắt buộc: định danh duy nhất
      shouldDetach: 'no',       // Tuỳ chọn: 'no' thì không cache
      scrollContain: ['#list']  // Tuỳ chọn: selector để nhớ thanh cuộn
    }
  }
];

// Hook vòng đời component
export class ListComponent {
  _onReuseInit() {
    console.log('Trang được khôi phục từ cache');
  }
  _onReuseDestroy() {
    console.log('Trang được đưa vào cache');
  }
}
```

### 2. Lắng nghe layout responsive
Dùng `WindowsWidthService` để phản ứng thay đổi màn hình:

```typescript
// Inject service
private winWidthService = inject(WindowsWidthService);

// Lắng nghe breakpoint
this.winWidthService.getWindowWidthStore()
  .pipe(takeUntilDestroyed())
  .subscribe(width => {
    console.log('Breakpoint hiện tại:', width); // xs, sm, md, lg, xl, xxl
  });
```

### 3. Điều khiển nhiều tab
Hỗ trợ mở chi tiết trong tab mới hoặc tái sử dụng component trong cùng tab.

```typescript
// Kịch bản A: Từ danh sách sang chi tiết, mở tab mới — xem demo trên site, menu: Tính năng > Thao tác tab > Mở trang chi tiết 1/2/3
{ 
  path: 'detail/:id', 
  component: DetailComponent, 
  data: { newTab: 'true', title: 'Chi tiết', key: 'detail' } 
}

// Kịch bản B: Hai route khác nhau dùng chung một component (ví dụ “Thêm” và “Sửa”), mở trong tab hiện tại — xem demo, menu: Quản trị hệ thống > Quản lý vai trò > Thiết lập quyền
// Chỉ cần title giống nhau, hệ thống tab sẽ coi là cùng một nhóm nghiệp vụ
{ path: 'add', component: FormComponent, title: 'Quản lý người dùng' },
{ path: 'edit/:id', component: FormComponent, title: 'Quản lý người dùng' }
```

---

## 🗂️ Phiên bản

| Phiên bản ng-antd-admin | Angular | Mô tả | Tải |
|-------------------|-------------|------|------|
| **Master (mới nhất)** | **Angular 21+** | Kiến trúc mới, khuyến nghị dùng | [Mã nguồn](https://github.com/huajian123/ng-antd-admin) |
| v18.x | Angular 18 | Bản ổn định | [Tải](https://github.com/huajian123/ng-antd-admin/tree/v18) |
| v17.x | Angular 17 | Có Signals | [Tải](https://github.com/huajian123/ng-antd-admin/tree/v17) |
| v15.x | Angular 15 | Phiên bản NgModule truyền thống | [Tải](https://github.com/huajian123/ng-antd-admin/tree/v15) |

> ⚠️ **Lưu ý**: Từ Angular 15+ có Standalone Components, cấu trúc dự án thay đổi nhiều. Hãy chọn phiên bản phù hợp stack của team.

---

## 🤖 Làm quen với AI

Dự án duy trì bộ **tài liệu meta-model** trong `docs/meta-model/`, bao quát bản đồ module, luồng lõi, hệ thống quyền, quản lý trạng thái và vùng thay đổi rủi ro.

Nếu dùng trợ lý AI (Claude, Cursor, Copilot…), có thể đưa `meta-index.md` cho AI để nắm nhanh toàn bộ dự án mà không cần quét hết repo.

### Cách dùng gợi ý

**1. Nắm nhanh cấu trúc**

Dán nội dung `docs/meta-model/meta-index.md` vào hội thoại rồi hỏi:

```
Đọc xong mục lục này, hãy giải thích kiến trúc tổng thể của dự án
```

**2. Tìm mã nguồn một tính năng**

```
Tham chiếu meta-index.md, giúp tìm chỗ triển khai tính năng "nhiều tab"
```

**3. Xử lý yêu cầu hoặc bug**

```
Đọc docs/meta-model/meta-index.md trước, tôi muốn thêm "vô hiệu hóa hàng loạt" cho trang quản lý tài khoản, chỉ rõ phạm vi ảnh hưởng và file cần sửa
```

**4. Hiểu một luồng lõi**

```
Tham chiếu docs/meta-model/flow-index.md, tóm tắt luồng từ đăng nhập đến tải quyền
```

### Mục lục tài liệu

| Tài liệu | Nội dung |
|------|------|
| [meta-index.md](./docs/meta-model/meta-index.md) | Cổng vào, đọc trước |
| [module-index.md](./docs/meta-model/module-index.md) | Bản đồ tất cả module trang |
| [functional-inventory.md](./docs/meta-model/functional-inventory.md) | Danh sách tính năng (tính năng → route → mã nguồn) |
| [auth-login-index.md](./docs/meta-model/auth-login-index.md) | Xác thực và phân quyền |
| [flow-index.md](./docs/meta-model/flow-index.md) | Luồng lõi (đăng nhập, HTTP, tái sử dụng route…) |
| [change-hotspots.md](./docs/meta-model/change-hotspots.md) | Vùng thay đổi rủi ro cao, bắt buộc đọc khi phát triển tiếp |

> Tài liệu meta-model được cập nhật theo dự án. Nếu thấy lệch so với code, rất hoan nghênh PR chỉnh sửa.

---

## 🤝 Đóng góp

Mọi hình thức đóng góp đều được chào đón!
- 🐛 **Báo lỗi**: Mô tả rõ các bước tái hiện.
- 💡 **Đề xuất tính năng**: Nêu tính năng bạn mong muốn.
- 📝 **Cải thiện tài liệu**: Giúp bổ sung tài liệu và chú thích.
- 🔧 **Pull Request**: Gửi cải tiến mã nguồn.

### Lệnh chuẩn phát triển
```bash
npm run prettier      # Định dạng code
npm run lint          # Kiểm tra ESLint
npm run lint:fix      # Sửa tự động lỗi lint
npm run lint:style    # Kiểm tra style
```

---

## ⭐ Lịch sử Star

Nếu dự án hữu ích với bạn, hãy cho một **Star** ⭐️ nhé!

[![Star History Chart](https://api.star-history.com/svg?repos=huajian123/ng-antd-admin&type=Date)](https://star-history.com/#huajian123/ng-antd-admin&Date)

---

## 💼 Liên hệ và hỗ trợ

### 💬 Nhóm trao đổi
Nếu có góp ý hay muốn tham gia phát triển, thêm WeChat: **hj345678912**, ghi chú "Angular", tác giả sẽ mời vào nhóm học cùng nhau.

### 💼 Hợp tác thương mại
Nhận phát triển tuỳ biến doanh nghiệp, làm việc từ xa, outsource bán thời gian.
- **Frontend**: Angular, React, Vue
- **Backend**: NestJS, Node.js
- **Mobile**: React Native, Flutter

### ☕ Ủng hộ tác giả
Nếu dự án hữu ích và bạn muốn mời tác giả một ly cà phê, quét mã bên dưới. Cảm ơn bạn<br>

| WeChat | Alipay |
|:---:|:---:|
| <img src="https://github.com/huajian123/ng-antd-admin/blob/master/ui/projectImg/weixin.jpeg" width="150" alt="WeChat"/> | <img src="https://github.com/huajian123/ng-antd-admin/blob/master/ui/projectImg/zhifubao.jpeg" width="150" alt="Alipay"/> |

---

## 📄 Giấy phép mã nguồn mở

Dự án phát hành theo [MIT License](https://github.com/huajian123/ng-antd-admin/blob/master/LICENSE).

**Made with ❤️ by huajian123**
