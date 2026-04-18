import { Platform } from '@angular/cdk/platform';
import { inject, Injectable, DOCUMENT } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly _doc = inject(DOCUMENT);
  private readonly platform = inject(Platform);
  private _getDoc(): Document {
    return this._doc || document;
  }

  private _getWin(): Window {
    const doc = this._getDoc();
    return doc.defaultView || window;
  }

  /**
   * Lấy vị trí thanh cuộn
   *
   * @param element Chỉ định phần tử, mặc định `window`
   */
  getScrollPosition(element?: Element | Window): [number, number] {
    if (!this.platform.isBrowser) {
      return [0, 0];
    }

    const win = this._getWin();
    if (element && element !== win) {
      return [(element as Element).scrollLeft, (element as Element).scrollTop];
    } else {
      return [win.pageXOffset, win.pageYOffset];
    }
  }

  /**
   * Đặt vị trí thanh cuộn
   *
   * @param element Phần tử chỉ định
   * @param position
   */
  scrollToPosition(element: Element | Window | null | undefined, position: [number, number]): void {
    if (!this.platform.isBrowser) {
      return;
    }
    (element || this._getWin()).scrollTo(position[0], position[1]);
  }

  /**
   * Đặt thanh cuộn đến phần tử chỉ định
   *
   * @param element Chỉ định phần tử, mặc định `document.body`
   * @param topOffset Giá trị bù, mặc định `0`
   */
  scrollToElement(element?: Element | null, topOffset = 0): void {
    if (!this.platform.isBrowser) {
      return;
    }
    if (!element) {
      element = this._getDoc().body;
    }

    element.scrollIntoView();

    const win = this._getWin();
    if (win && win.scrollBy) {
      win.scrollBy(0, element!.getBoundingClientRect().top - topOffset);

      if (win.pageYOffset < 20) {
        win.scrollBy(0, -win.pageYOffset);
      }
    }
  }

  /**
   * Cuộn lên đầu
   *
   * @param topOffset Giá trị bù, mặc định `0`
   */
  scrollToTop(topOffset = 0): void {
    if (!this.platform.isBrowser) {
      return;
    }
    this.scrollToElement(this._getDoc().body, topOffset);
  }
}
