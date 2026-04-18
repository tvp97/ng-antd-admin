import { computed, DestroyRef, inject, DOCUMENT } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

import { ScrollService } from '@core/services/common/scroll.service';
import { ThemeService } from '@store/common-store/theme.service';
import { fnGetReuseStrategyKeyFn, getDeepReuseStrategyKeyFn } from '@utils/tools';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

export type ReuseHookTypes = '_onReuseInit' | '_onReuseDestroy';

export interface ReuseComponentInstance {
  _onReuseInit: () => void;
  _onReuseDestroy: () => void;
}

export interface ReuseComponentRef {
  instance: ReuseComponentInstance;
}

/*Tái sử dụng định tuyến*/
// Tham khảohttps://zhuanlan.zhihu.com/p/29823560
// https://blog.csdn.net/weixin_30561425/article/details/96985967?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control
export class SimpleReuseStrategy implements RouteReuseStrategy {
  destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);
  private readonly scrollService = inject(ScrollService);

  // Bộ đệm từng cáicomponentcủamap
  static handlers: Record<string, NzSafeAny> = {};
  // Lưu vào bộ nhớ đệm từng trangscrollVị trí,Tại sao không đặt vàohandlersBên trong thì,Bởi vì khi rời khỏi router, việc tái sử dụng router dẫn đến lấy trang hiện tại làmkeyvìnullrồi
  static scrollHandlers: Record<string, NzSafeAny> = {};

  // Mục đích của tham số này là nhấp vào trong tab hiện tạiXóaNút bấm, mặc dù tab đã đóng, nhưng khi rời khỏi tuyến đường, vẫn sẽ lưu bộ nhớ đệm của thành phần tab đã đóng.
  // Sử dụng tham số này để ghi lại, có cần lưu trữ tạm thời tuyến đường hiện tại hay không
  public static waitDelete: string | null;
  themesService = inject(ThemeService); // Dùng để lấy chủ đề
  // Có nhiều tab hay không, nếu không có nhiều tab thì không thực hiện lưu bộ nhớ đệm định tuyến
  $isShowTab = computed(() => {
    return this.themesService.$themesOptions().isShowTab;
  });

  public static deleteRouteSnapshot(key: string): void {
    if (SimpleReuseStrategy.handlers[key]) {
      if (SimpleReuseStrategy.handlers[key].componentRef) {
        SimpleReuseStrategy.handlers[key].componentRef.destroy();
      }
      delete SimpleReuseStrategy.handlers[key];
      delete SimpleReuseStrategy.scrollHandlers[key];
    }
  }

  // XóaXóa tất cả bộ nhớ đệm khi đăng xuất, không sử dụng nhiều thẻ Cần sử dụng trong các thao tác chờ
  public static deleteAllRouteSnapshot(route: ActivatedRouteSnapshot): Promise<void> {
    return new Promise(resolve => {
      Object.keys(SimpleReuseStrategy.handlers).forEach(key => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
      });
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(route);
      resolve();
    });
  }

  // Có cho phép tái sử dụng tuyến đường không
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Có hiển thị nhiều tab hay không, nếu không hiển thị nhiều tab thì không thực hiện tái sử dụng định tuyến
    const shouldDetach = route.data['shouldDetach'] !== 'no' && this.$isShowTab();
    // Ghi lại vị trí cuộn tại đây:shouldDetach ở outlet.detach() gọi trước đó,DOM Vẫn ở trong tài liệu
    // Thời điểm sửa đổi vị trí cuộn, nếu chỉ ghi lại khi rời khỏi tuyến đường, sẽ dẫn đến không thể lấy đượcdom
    if (shouldDetach && route.data['needKeepScroll'] !== 'no') {
      const key = fnGetReuseStrategyKeyFn(route);
      if (key) {
        const innerScrollContainer: Record<string, [number, number]>[] = [];
        const scrollContain: string[] = route.data['scrollContain'] ?? [];
        scrollContain.forEach(item => {
          const el = this.doc.querySelector(item);
          if (el) {
            innerScrollContainer.push({ [item]: this.scrollService.getScrollPosition(el) });
          }
        });
        innerScrollContainer.push({ window: this.scrollService.getScrollPosition() });
        SimpleReuseStrategy.scrollHandlers[key] = { scroll: innerScrollContainer };
      }
    }
    return shouldDetach;
  }

  // Khi rời khỏi tuyến đường sẽ được kích hoạt, lưu trữ tuyến đường
  store(route: ActivatedRouteSnapshot, handle: NzSafeAny): void {
    if (route.data['shouldDetach'] === 'no') {
      return;
    }
    const key = fnGetReuseStrategyKeyFn(route);
    // Nếu chờXóaNếu là tuyến đường hiện tại thì không lưu trữ snapshot
    if (SimpleReuseStrategy.waitDelete === key) {
      this.runHook('_onReuseDestroy', handle.componentRef);
      handle.componentRef.destroy();
      SimpleReuseStrategy.waitDelete = null;
      delete SimpleReuseStrategy.scrollHandlers[key];
      return;
    }

    // Vị trí cuộn đã ở shouldDetach Ghi lại trước thời gian, ở đây DOM Có thể đã bị loại bỏ, không còn hoạt động
    SimpleReuseStrategy.handlers[key] = handle;

    if (handle && handle.componentRef) {
      this.runHook('_onReuseDestroy', handle.componentRef);
    }
  }

  // Có cho phép khôi phục tuyến đường không
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = fnGetReuseStrategyKeyFn(route);
    return !!key && !!SimpleReuseStrategy.handlers[key];
  }

  // Lấy định tuyến lưu trữ
  // Nếu lấy thể hiện của thành phần định tuyến mục tiêu ở đây và thực thi vòng đời, sẽ dẫn đến việc vòng đời của thành phần được thực thi nhiều lần (lớn hơn hoặc bằng2lần), nhưng như vậy lại có thể tránhshouldReuseRoutedùng ở trongwhile
  // https://github.com/angular/angular/issues/43251
  // https://github.com/angular/angular/issues/42794
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = fnGetReuseStrategyKeyFn(route);
    return !key ? null : SimpleReuseStrategy.handlers[key];
  }

  // Kích hoạt khi vào tuyến đường, tái sử dụng tuyến đường khi cùng một tuyến đường
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const futureKey = fnGetReuseStrategyKeyFn(future);
    const currKey = fnGetReuseStrategyKeyFn(curr);
    if (!!futureKey && SimpleReuseStrategy.handlers[futureKey]) {
      this.runHook('_onReuseInit', SimpleReuseStrategy.handlers[futureKey].componentRef);
    }

    const result = futureKey === currKey;
    // Tải lười biếng không đọc đượcdata, thông qua phương pháp này khoan xuống cấp độ định tuyến thấp nhất
    while (future.firstChild) {
      future = future.firstChild;
    }
    // Lấy lại là vìfutureỞ trênwhileĐã thay đổi trong vòng lặp
    const scrollFutureKey = fnGetReuseStrategyKeyFn(future);
    if (!!scrollFutureKey && SimpleReuseStrategy.scrollHandlers[scrollFutureKey]) {
      SimpleReuseStrategy.scrollHandlers[scrollFutureKey].scroll.forEach((elOptionItem: Record<string, [number, number]>) => {
        Object.keys(elOptionItem).forEach(element => {
          setTimeout(() => {
            this.scrollService.scrollToPosition(this.doc.querySelector(element), elOptionItem[element]);
          }, 1);
        });
      });
    }
    return result;
  }

  runHook(method: ReuseHookTypes, comp: ReuseComponentRef): void {
    if (comp == null || !comp.instance) {
      return;
    }
    const compThis = comp.instance;
    const fn = compThis[method];
    if (typeof fn !== 'function') {
      return;
    }
    (fn as () => void).call(compThis);
  }
}
