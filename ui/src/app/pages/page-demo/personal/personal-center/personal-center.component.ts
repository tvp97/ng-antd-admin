import { Component, ChangeDetectionStrategy, ElementRef, viewChild, signal, afterNextRender, inject, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdComponent, DynamicComponent } from '@core/services/types';
import { AdDirective } from '@shared/directives/ad.directive';
import { NumberLoopPipe } from '@shared/pipes/number-loop.pipe';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { ApplicationComponent } from './application/application.component';
import { ArticleComponent } from './article/article.component';
import { ProjectsComponent } from './projects/projects.component';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/animation';

interface TabInterface {
  label: string;
  component: DynamicComponent;
}

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrl: './personal-center.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzGridModule,
    NzCardModule,
    NzAvatarModule,
    NzTypographyModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzTagModule,
    NzInputModule,
    FormsModule,
    NzTabsModule,
    AdDirective,
    NumberLoopPipe,
    NzNoAnimationDirective
  ]
})
export class PersonalCenterComponent {
  readonly tagArray = signal<string[]>(['Rất có ý tưởng', 'Tập trung vào thiết kế', 'Đùi dài', 'Cô gái Tứ Xuyên', 'Biển cả chứa muôn sông']);
  readonly inputVisible = signal(false);
  readonly inputValue = signal('');
  readonly inputElement = viewChild<ElementRef>('inputElement');
  readonly adHost = viewChild.required(AdDirective);

  readonly tabData: TabInterface[] = [
    { label: 'bài viết(8)', component: new DynamicComponent(ArticleComponent, {}) },
    { label: 'ứng dụng(8)', component: new DynamicComponent(ApplicationComponent, {}) },
    { label: 'dự án(8)', component: new DynamicComponent(ProjectsComponent, {}) }
  ];

  private readonly injector = inject(Injector);

  constructor() {
    afterNextRender(() => this.to(this.tabData[0]), { injector: this.injector });
  }

  to(adItem: TabInterface): void {
    const viewContainerRef = this.adHost().viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component.component);
    componentRef.instance.data = adItem.component.data;
  }

  handleInputConfirm(): void {
    const value = this.inputValue();
    if (value && !this.tagArray().includes(value)) {
      this.tagArray.update(tags => [...tags, value]);
    }
    this.inputValue.set('');
    this.inputVisible.set(false);
  }

  showInput(): void {
    this.inputVisible.set(true);
    afterNextRender(() => this.inputElement()?.nativeElement.focus(), { injector: this.injector });
  }
}
