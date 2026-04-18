import { Injectable } from '@angular/core';

export interface ModalResizeConfig {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Dịch vụ đổi kích thước hộp thoại
 */
@Injectable({
  providedIn: 'root'
})
export class ModalResizeService {
  private resizeHandles: HTMLElement[] = [];
  private isResizing = false;
  private currentHandle: string | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private startMarginLeft = 0;
  private startMarginTop = 0;
  private modalElement: HTMLElement | null = null;
  // .ant-modal Vỏ ngoài, dùng để n/w Vị trí lệch hướng, không gây cản trở CDK drag của transform
  private modalOuterElement: HTMLElement | null = null;

  createResizeHandlers(wrapCls: string, config: ModalResizeConfig = {}): void {
    const wrapElement = document.querySelector<HTMLDivElement>(`.${wrapCls}`)!;
    const modalContent = wrapElement.querySelector<HTMLDivElement>(`.ant-modal-content`)!;

    if (!modalContent) {
      return;
    }

    this.modalElement = modalContent;
    this.modalOuterElement = wrapElement.querySelector<HTMLDivElement>('.ant-modal');
    const initialHeight = modalContent.getBoundingClientRect().height;
    const defaultConfig: ModalResizeConfig = {
      minWidth: 400,
      maxWidth: window.innerWidth - 100,
      maxHeight: window.innerHeight - 100,
      ...config,
      // bằng modal Chiều cao thực tế khi mở làm chiều cao tối thiểu
      minHeight: initialHeight,
    };

    const handles = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];

    handles.forEach(direction => {
      const handle = document.createElement('div');
      handle.className = `modal-resize-handle modal-resize-handle-${direction}`;
      handle.dataset['direction'] = direction;
      modalContent.appendChild(handle);
      this.resizeHandles.push(handle);

      handle.addEventListener('mousedown', (e: MouseEvent) => {
        this.startResize(e, direction, defaultConfig);
      });
    });

    modalContent.style.position = 'relative';
  }

  private startResize(e: MouseEvent, direction: string, config: ModalResizeConfig): void {
    e.preventDefault();
    e.stopPropagation();

    if (!this.modalElement) {
      return;
    }

    this.isResizing = true;
    this.currentHandle = direction;
    this.startX = e.clientX;
    this.startY = e.clientY;

    const rect = this.modalElement.getBoundingClientRect();
    const minWidth = config.minWidth || 400;
    const minHeight = config.minHeight || 300;

    // Ghi lại giá trị lớn nhất của kích thước thực tế và giá trị tối thiểu làm giá trị khởi đầu, không ghi trước style, tránh cố định auto chiều cao
    this.startWidth = Math.max(rect.width, minWidth);
    this.startHeight = Math.max(rect.height, minHeight);

    // ghi chép .ant-modal hiện tại margin Độ lệch như vị trí bắt đầu (n/w Hướng thông qua margin Di chuyển, không chạm CDK drag của transform）
    const outer = this.modalOuterElement;
    if (outer) {
      // getComputedStyle Có thể phân tích đúng autođược giá trị pixel thực tế
      const computed = getComputedStyle(outer);
      this.startMarginLeft = parseFloat(computed.marginLeft) || 0;
      this.startMarginTop = parseFloat(computed.marginTop) || 0;
      // sẽ auto margin Cố định thành giá trị pixel, ngăn chặn việc bị ảnh hưởng khi thiết lập sau này auto bao phủ
      outer.style.marginLeft = `${this.startMarginLeft}px`;
      outer.style.marginTop = `${this.startMarginTop}px`;
    } else {
      this.startMarginLeft = 0;
      this.startMarginTop = 0;
    }

    const onMouseMove = (moveEvent: MouseEvent): void => {
      this.resize(moveEvent, config);
    };

    const onMouseUp = (): void => {
      this.stopResize();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Thêm body Kiểu dáng để ngăn chọn văn bản
    document.body.style.userSelect = 'none';
    document.body.style.cursor = this.getCursor(direction);
  }

  /**
   * Thay đổi kích thước
   */
  private resize(e: MouseEvent, config: ModalResizeConfig): void {
    if (!this.isResizing || !this.modalElement || !this.currentHandle) {
      return;
    }

    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;

    const minWidth = config.minWidth || 400;
    const minHeight = config.minHeight || 300;
    const maxWidth = config.maxWidth || window.innerWidth;
    const maxHeight = config.maxHeight || window.innerHeight;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;
    let newMarginLeft = this.startMarginLeft;
    let newMarginTop = this.startMarginTop;

    if (this.currentHandle.includes('e')) {
      newWidth = this.startWidth + deltaX;
    }
    if (this.currentHandle.includes('w')) {
      newWidth = this.startWidth - deltaX;
      newMarginLeft = this.startMarginLeft + deltaX;
    }
    if (this.currentHandle.includes('s')) {
      newHeight = this.startHeight + deltaY;
    }
    if (this.currentHandle.includes('n')) {
      newHeight = this.startHeight - deltaY;
      newMarginTop = this.startMarginTop + deltaY;
    }

    // Áp dụng hạn chế kích thước và hiệu chỉnh ngược margin, ngăn vị trí trôi khi nhỏ hơn giá trị tối thiểu
    if (newWidth < minWidth) {
      if (this.currentHandle.includes('w')) {
        newMarginLeft = this.startMarginLeft + (this.startWidth - minWidth);
      }
      newWidth = minWidth;
    }
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
    }
    if (newHeight < minHeight) {
      if (this.currentHandle.includes('n')) {
        newMarginTop = this.startMarginTop + (this.startHeight - minHeight);
      }
      newHeight = minHeight;
    }
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
    }

    this.modalElement.style.width = `${newWidth}px`;
    this.modalElement.style.height = `${newHeight}px`;

    // n/w Hướng thông qua thao tác .ant-modal của margin Di chuyển vị trí, hoàn toàn không chạm CDK drag quản lý transform
    if (this.modalOuterElement) {
      if (this.currentHandle.includes('w')) {
        this.modalOuterElement.style.marginLeft = `${newMarginLeft}px`;
      }
      if (this.currentHandle.includes('n')) {
        this.modalOuterElement.style.marginTop = `${newMarginTop}px`;
      }
    }
  }

  /**
   * Dừng thay đổi kích thước
   */
  private stopResize(): void {
    this.isResizing = false;
    this.currentHandle = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }

  /**
   * Lấy kiểu con trỏ
   */
  private getCursor(direction: string): string {
    const cursorMap: Record<string, string> = {
      n: 'ns-resize',
      s: 'ns-resize',
      e: 'ew-resize',
      w: 'ew-resize',
      ne: 'nesw-resize',
      sw: 'nesw-resize',
      nw: 'nwse-resize',
      se: 'nwse-resize'
    };
    return cursorMap[direction] || 'default';
  }

  /**
   * Dọn dẹp tay cầm điều chỉnh kích thước
   */
  dispose(): void {
    this.resizeHandles.forEach(handle => {
      handle.remove();
    });
    this.resizeHandles = [];
    this.modalElement = null;
    this.modalOuterElement = null;
    this.stopResize();
  }
}
