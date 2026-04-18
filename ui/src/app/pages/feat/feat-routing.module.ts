import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'ex-modal', pathMatch: 'full' },
  { path: 'ex-modal', title: 'Modal kéo thả', data: { key: 'ex-modal' }, loadComponent: () => import('./ex-modal/ex-modal.component').then(m => m.ExModalComponent) },
  { path: 'ex-drawer', title: 'Đóng gói ngăn kéo', data: { key: 'ex-drawer' }, loadComponent: () => import('./ex-drawer/ex-drawer.component').then(m => m.ExDrawerComponent) },
  { path: 'msg', title: 'Thông báo', data: { key: 'msg' }, loadComponent: () => import('./msg/msg.component').then(m => m.MsgComponent) },
  { path: 'frame', loadChildren: () => import('./frame/frame-routing') },
  { path: 'rich-text', title: 'Văn bản giàu định dạng', data: { key: 'rich-text' }, loadComponent: () => import('./rich-text/rich-text.component').then(m => m.RichTextComponent) },
  { path: 'upload', title: 'Tải tệp lên', data: { key: 'upload' }, loadComponent: () => import('./upload/upload.component').then(m => m.UploadComponent) },
  {
    path: 'context-menu',
    title: 'Menu chuột phải',
    data: { key: 'context-menu' },
    loadComponent: () => import('./context-menu/context-menu.component').then(m => m.ContextMenuComponent)
  },
  {
    path: 'session-timeout',
    title: 'Đăng nhập hết hạn',
    data: { key: 'session-timeout' },
    loadComponent: () => import('./session-timeout/session-timeout.component').then(m => m.SessionTimeoutComponent)
  },
  {
    path: 'click-out-side',
    title: 'clickOutSide',
    data: { key: 'click-out-side' },
    loadComponent: () => import('./click-out-side/click-out-side.component').then(m => m.ClickOutSideComponent)
  },
  { path: 'color-sel', title: 'Bộ chọn màu', data: { key: 'color-sel' }, loadComponent: () => import('./color-sel/color-sel.component').then(m => m.ColorSelComponent) },
  { path: 'scroll', loadChildren: () => import('./scroll/scroll-routing.module') },
  { path: 'img-preview', title: 'Xem trước hình ảnh', data: { key: 'img-preview' }, loadComponent: () => import('./img-preview/img-preview.component').then(m => m.ImgPreviewComponent) },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs-routing') },
  { path: 'websocket', title: 'websocketkiểm tra', data: { key: 'websocket' }, loadComponent: () => import('./websocket/websocket.component').then(m => m.WebsocketComponent) },
  { path: 'full-screen', title: 'Toàn màn hình', data: { key: 'full-screen' }, loadComponent: () => import('./full-screen/full-screen.component').then(m => m.FullScreenComponent) },
  { path: 'icons', title: 'Biểu tượng', data: { key: 'icons' }, loadComponent: () => import('./icons/icons.component').then(m => m.IconsComponent) },
  { path: 'charts', loadChildren: () => import('./charts/charts-routing') },
  { path: 'ripple', title: 'Gợn sóng nước', data: { key: 'ripple' }, loadComponent: () => import('./ripple/ripple.component').then(m => m.RippleComponent) },
  { path: 'copy', title: 'Bảng tạm', data: { key: 'copy' }, loadComponent: () => import('./copy/copy.component').then(m => m.CopyComponent) },
  { path: 'setup', title: 'Trang dẫn hướng', data: { key: 'setup' }, loadComponent: () => import('./setup/setup.component').then(m => m.SetupComponent) },
  { path: 'download', title: 'Tải tệp', data: { key: 'download' }, loadComponent: () => import('./download/download.component').then(m => m.DownloadComponent) },
  { path: 'qrcode', title: 'Mã QR', data: { key: 'qrcode' }, loadComponent: () => import('./qrcode/qrcode.component').then(m => m.QrcodeComponent) },
  { path: 'water-mark', title: 'Dấu chìm', data: { key: 'water-mark' }, loadComponent: () => import('./water-mark/water-mark.component').then(m => m.WaterMarkDemoComponent) },
  { path: 'keep-alive', title: 'KeepAlive', data: { key: 'keep-alive' }, loadComponent: () => import('./keep-alive/keep-alive').then(m => m.KeepAliveDemo) },
  { path: 'transitions', loadChildren: () => import('./transitions/transitions-routing') },
  {
    path: 'feat1',
    title: 'Tính năng mới1',
    data: { key: 'feat1' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  },
  {
    path: 'feat3',
    title: 'Tính năng mới3',
    data: { key: 'feat3' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  },
  {
    path: 'feat4',
    title: 'Tính năng mới4',
    data: { key: 'feat4' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  },
  {
    path: 'feat5',
    title: 'Tính năng mới5',
    data: { key: 'feat5' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  }
] satisfies Route[];
