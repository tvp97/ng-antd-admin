import { inject, Injectable, DOCUMENT } from '@angular/core';

/*
 * Cuộn lên đầupredịch vụ
 * */
@Injectable({
  providedIn: 'root'
})
export class PreloaderService {
  private readonly doc = inject(DOCUMENT);

  removePreLoader(): void {
    const el = this.doc.getElementById('globalLoader');
    if (el) {
      el.addEventListener('transitionend', () => {
        el.className = 'global-loader-hidden';
      });

      if (!el.classList.contains('global-loader-hidden')) {
        el.className += ' global-loader-fade-in';
      }
    }
  }
}
