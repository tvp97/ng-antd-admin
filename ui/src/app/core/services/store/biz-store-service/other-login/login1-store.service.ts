import { Injectable, signal } from '@angular/core';

import { LoginType } from '@app/pages/other-login/login1/login1.component';

// Đây là bộ nhớ đệmlogin1củastorethuộc về kinh doanhstore
@Injectable({
  providedIn: 'root'
})
export class Login1StoreService {
  $loginTypeStore = signal<LoginType>(LoginType.Normal);

  isLogin1OverModelSignalStore = signal<boolean>(false);
}
