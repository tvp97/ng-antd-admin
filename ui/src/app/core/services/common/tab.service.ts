import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, UrlSegment } from '@angular/router';

import { getDeepReuseStrategyKeyFn, fnGetPathWithoutParam } from '@utils/tools';
import _ from 'lodash';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { SimpleReuseStrategy } from './reuse-strategy';

export interface TabModel {
  title: string;
  path: string;
  snapshotArray: ActivatedRouteSnapshot[];
}

/*
 * tabDịch vụ vận hành
 * */
@Injectable({
  providedIn: 'root'
})
export class TabService {
  $tabArray = signal<TabModel[]>([]);
  $currSelectedIndexTab = signal(0);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  clearTabs(): void {
    this.$tabArray.set([]);
  }

  addTab(tabModel: TabModel, isNewTabDetailPage = false): void {
    // Nếu là thao tác làm mới
    if (tabModel.title === 'refresh-empty') {
      return;
    }
    this.$tabArray.update(tabs => {
      tabs.forEach(tab => {
        if (tab.title === tabModel.title && !isNewTabDetailPage) {
          // Danh sáchChi tiếtCác thao tác, ví dụ như nhấp vào biểu mẫu người dùngChi tiết，trong hiện tạitabMở cái này ở giữaChi tiếtBạn có thể xem ví dụ trực tuyến:"Bảng tra cứu"với trong bảng"Xem nút"
          // titleCần có biểu mẫu người dùngChi tiếtĐịnh tuyến thành phầntitletương tự
          // mỗi cáitabLưu ảnh chụp nhanh của thành phần dướitabTrong mảng, dưới đây đã thực hiện thao tác loại bỏ trùng lặp
          tab.snapshotArray = _.uniqBy([...tab.snapshotArray, ...tabModel.snapshotArray], item => {
            // @ts-ignore
            return item['_routerState'].url;
          });
          // Mở trong trang hiện tạiChi tiếtkhi cần, phải đưa tương ứngtabcủapaththay thế
          tab.path = tabModel.path;
        }
      });
      if (!tabs.find(value => value.path === tabModel.path)) {
        return [...tabs, tabModel];
      }
      return [...tabs];
    });
  }

  getTabArray(): TabModel[] {
    return this.$tabArray();
  }

  changeTabTitle(title: string): void {
    this.$tabArray.update(tabs => {
      tabs[this.$currSelectedIndexTab()].title = title;
      return [...tabs];
    });
  }

  // quakeyĐếnXóaĐang tái sử dụng định tuyếnSimpleReuseStrategy.handlersBộ nhớ đệm bên trong này
  delReuseStrategy(snapshotArray: ActivatedRouteSnapshot[]): void {
    // beDeleteKeyMảngLưuCác tuyến liên quankey, giải quyết"Trong hiện tạitabmởChi tiếtTrang thời gian"và sinh ra"Ở trang nào (trang danh sách hay danh sách củaChi tiếtNhấp vào nút đóng trên trang,Trang bị nhấp (danh sách hoặc trong danh sáchChi tiếtTrang, trạng thái của một trong số đó mới bị xóa, cái kia thì không bị xóa"củabug
    const beDeleteKeysArray = this.getSnapshotArrayKey(snapshotArray);
    beDeleteKeysArray.forEach(item => {
      SimpleReuseStrategy.deleteRouteSnapshot(item);
    });
  }

  // theotabBản chụp nhanh của tuyến trong bộ nhớ cache, xây dựng tái sử dụng tuyếnkey Ví dụ: login{name:'zhangsan'},Như vậykey+paramdạng là được lưu trong bộ nhớ đệmSimpleReuseStrategy.handlerstrong
  getSnapshotArrayKey(activatedArray: ActivatedRouteSnapshot[]): string[] {
    const temp: string[] = [];
    activatedArray.forEach(item => {
      const key = getDeepReuseStrategyKeyFn(item);
      temp.push(key);
    });
    return temp;
  }

  // Nhấp chuột phảitabXóa tất cả bên phảitab，indexĐược chọn bởi chuộttabChỉ mục
  delRightTab(tabPath: string, index: number): void {
    const tabs = this.$tabArray();
    // Lấy chờXóacủatab
    const beDelTabArray = tabs.filter((_, tabindex) => tabindex > index);
    // Gỡ bỏ mục đã chọn bằng chuột phảitabTất cả ở bên phảitab
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });
    this.$tabArray.set(tabs.slice(0, index + 1));
    // Nếu nhấn chuột phải chọntabChỉ mục nhỏ hơn hiển thị hiện tạitabcủa chỉ mục, phải cùng với những gì đang mởtabcũng phải bịXóa
    if (index < this.$currSelectedIndexTab()) {
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.router.navigateByUrl(this.$tabArray()[index].path);
    }
  }

  // Nhấp chuột phải để loại bỏ tất cả bên tráitab
  /*
   * @params index Vị trí hiện tại của chuột khi nhấn chuột phảitabChỉ mục
   * */
  delLeftTab(tabPath: string, index: number): void {
    const tabs = this.$tabArray();
    // MuốnXóacủatab
    const beDelTabArray = tabs.filter((_, tabindex) => tabindex < index);

    // Trước tiên xử lý mối quan hệ chỉ mục
    if (this.$currSelectedIndexTab() === index) {
      this.$currSelectedIndexTab.set(0);
    } else if (this.$currSelectedIndexTab() < index) {
      // Nếu nhấp chuộttabChỉ mục lớn hơn chỉ mục hiện tại, cần phải làm trang hiện tạipathđặt vàowaitDeleteTrung
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.$currSelectedIndexTab.set(0);
    } else if (this.$currSelectedIndexTab() > index) {
      this.$currSelectedIndexTab.set(this.$currSelectedIndexTab() - beDelTabArray.length);
    }

    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });
    // còn lạitab
    this.$tabArray.set(tabs.slice(beDelTabArray.length));
    this.router.navigateByUrl(this.$tabArray()[this.$currSelectedIndexTab()].path);
  }

  // Nhấp chuột phảitabchọn"Gỡ bỏ cái kháctab"
  delOtherTab(path: string, index: number): void {
    const tabs = this.$tabArray();
    // MuốnXóacủatab
    const beDelTabArray = tabs.filter((_, tabindex) => tabindex !== index);

    // Xử lý những gì cần hiển thịtab
    // Gỡ bỏ cầnXóacủatabbộ nhớ đệm
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });

    // Nếu được chọn bằng chuộttabchỉ mục, không phải trang hiện đang mởtabcủa chỉ mục, thì cần phải lấy trang hiện tại củakeyLàwaitDeleteNgăn chặn điều hiện tại nàytabCác thành phần đã hiển thị vẫn được lưu trong bộ nhớ đệm sau khi bị loại bỏ
    if (index !== this.$currSelectedIndexTab()) {
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
    }
    // Phải trước tiên set lại navigateByUrl, bởi vì sự thay đổi đường dẫn sẽ kích hoạt nav-bar của setupRouterListener，
    // Bên trong sẽ gọi findIndex()lúc này $tabArray Phải ở trạng thái mới nhất.
    this.$tabArray.set([tabs[index]]);
    this.router.navigateByUrl(path);
  }

  // Nhấptabtrên nhãnxBiểu tượngXóatabđộng tác,Hoặc nhấp chuột phải Nhấp"Xóahiện tạitab"Động tác
  delTab(tab: TabModel, index: number): void {
    const tabs = this.$tabArray();
    const updated = [...tabs];
    updated.splice(index, 1);
    // Gỡ bỏ những gì đang hiển thị hiện tạitab
    if (index === this.$currSelectedIndexTab()) {
      const seletedTabKey = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.$tabArray.set(updated);
      // Xử lý mối quan hệ chỉ mục
      this.$currSelectedIndexTab.set(index - 1 < 0 ? 0 : index - 1);
      // phải ở trong navigateByUrl Cài đặt trước waitDelete, nếu không khi rời khỏi đường dẫn store() Đã thực hiện,
      // waitDelete Chưa được gán giá trị, bịXóaCác thành phần định tuyến sẽ được lưu trong bộ nhớ đệm, dẫn đến việc sử dụng lại các thể hiện cũ khi vào lần sau.
      SimpleReuseStrategy.waitDelete = seletedTabKey;
      // Chuyển đến mớitab
      this.router.navigateByUrl(this.$tabArray()[this.$currSelectedIndexTab()].path);
    } else if (index < this.$currSelectedIndexTab()) {
      // Nếu được chọn bằng chuộttabChỉ mục nhỏ hơn hiển thị hiện tạitabChỉ mục, tức là cái được lựa chọn bởi chuộttabTrong hiện tạitabbên trái
      this.$tabArray.set(updated);
      this.$currSelectedIndexTab.set(this.$currSelectedIndexTab() - 1);
    } else if (index > this.$currSelectedIndexTab()) {
      // Gỡ tab bên phải của tab hiện tại
      this.$tabArray.set(updated);
    }
    // Hành động này nhằm giải quyết ví dụ như trong trang danh sách cóChi tiếttrang, trang danh sách vàChi tiếtTrạng thái của hai trangLưuVấn đề, chỉ có thể loại bỏ khi đã giải quyết
    // Trang hiện tại đã bị đóngtabtrạng thái trung bìnhbug
    // Xóađã chọntabẢnh chụp nhanh đã được lưu trong bộ nhớ đệm
    this.delReuseStrategy(tab.snapshotArray);
  }

  findIndex(path: string): number {
    const current = this.$tabArray().findIndex(tabItem => path === tabItem.path);
    this.$currSelectedIndexTab.set(current);
    return current;
  }

  getCurrentPathWithoutParam(urlSegmentArray: UrlSegment[], queryParam: Record<string, NzSafeAny>): string {
    const temp: string[] = [];
    // Lấy tất cả các tham sốvalue
    const queryParamValuesArray = Object.values(queryParam);
    urlSegmentArray.forEach(urlSeqment => {
      // biểu thị tham sốurlLoại bỏ đoạn
      if (!queryParamValuesArray.includes(urlSeqment.path)) {
        temp.push(urlSeqment.path);
      }
    });
    return `${temp.join('/')}`;
  }

  // Làm mới
  refresh(): void {
    // Lấy ảnh chụp nhanh tuyến đường hiện tại
    let snapshot = this.activatedRoute.snapshot;
    const key = getDeepReuseStrategyKeyFn(snapshot);
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    let params: Params;
    let urlWithOutParam = ''; // Đây là không có tham sốurl
    // Là đường dẫn truyền tham số và có tham số
    if (Object.keys(snapshot.params).length > 0) {
      params = snapshot.params;
      // @ts-ignore
      urlWithOutParam = this.getCurrentPathWithoutParam(snapshot['_urlSegment'].segments, params);
      this.router.navigateByUrl('/default/refresh-empty', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([urlWithOutParam, ...Object.values(params)]);
      });
    } else {
      // làqueryĐường dẫn truyền tham số,Hoặc là tuyến đường không có tham số
      params = snapshot.queryParams;
      const sourceUrl = this.router.url;
      const currentRoute = fnGetPathWithoutParam(sourceUrl);
      // làqueryTruyền tham số
      this.router.navigateByUrl('/default/refresh-empty', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([currentRoute], { queryParams: params });
      });
    }
  }

  getCurrentTabIndex(): number {
    return this.$currSelectedIndexTab();
  }
}
