import { Component, ChangeDetectionStrategy, AfterViewInit, ElementRef, viewChild } from '@angular/core';

import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-flow-chat',
  templateUrl: './flow-chat.component.html',
  styleUrl: './flow-chat.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, NzResultModule, NzGridModule, NzButtonModule, NzTooltipModule, NzIconModule]
})
export class FlowChatComponent implements AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Quy trìnhSửaCórồi quy trình, tôi sẽ biết mình nên làm gì trong tương lai',
    breadcrumb: ['Trang chủ', 'Chức năng mở rộng', 'Đồ họaSửakhí', 'Sơ đồ quy trình'],
    desc: 'Ngàn lời không bằng một bức tranh, sơ đồ quy trình là phương pháp tốt để thể hiện ý tưởng thuật toán(Ví dụ sơ đồ quy trình đơn giản,Các chức năng cụ thể cần tự mình hoàn thiện,antV x6)'
  };
  graph!: Graph;
  readonly container = viewChild.required<ElementRef>('container');

  /** x6Một số thuộc tính cơ bản của canvas */
  graphBasicConfig = {
    grid: {
      size: 10, // Kích thước lưới 10px
      visible: true // Kết xuất nền lưới
    },
    panning: true, // Kéo thả canvas
    selecting: true,
    height: 400,
    connecting: {
      snap: true, // Trong quá trình kết nối, khoảng cách đến nút hoặc trụ kết nối 50px Khi đó sẽ kích hoạt tự động hút
      allowBlank: false, // Có cho phép kết nối với các điểm trên vị trí trống của canvas không
      allowLoop: false, // Có cho phép tạo kết nối vòng lặp, tức là nút bắt đầu và nút kết thúc của cạnh là cùng một nút không
      allowNode: false, // Có cho phép cạnh liên kết đến nút (không phải chấu liên kết trên nút) hay không
      allowEdge: false, // Có cho phép một cạnh liên kết đến một cạnh khác không
      connector: 'rounded',
      connectionPoint: 'boundary'
    }
  };

  drag(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const shap = target.getAttribute('shap')!;

    const dnd = new Dnd({
      target: this.graph
    });

    const node = this.graph.createNode({
      width: 100,
      height: 100,
      shape: shap,
      ports: {
        groups: {
          // Nhập định nghĩa nhóm cọc liên kết
          in: {
            position: 'top',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff'
              }
            }
          },
          // Xuất định nghĩa nhóm chốt liên kết
          out: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff'
              }
            }
          }
        },
        items: [
          {
            id: 'port1',
            group: 'in'
          },
          {
            id: 'port2',
            group: 'in'
          },
          {
            id: 'port3',
            group: 'in'
          },
          {
            id: 'port4',
            group: 'out'
          },
          {
            id: 'port5',
            group: 'out'
          }
        ]
      },
      attrs: {
        body: {
          // fill: '#ccc'
        }
      }
    });
    dnd.start(node, event);
  }

  initGraph(): void {
    const graphConfig = {
      ...this.graphBasicConfig,
      container: this.container().nativeElement
    };
    this.graph = new Graph(graphConfig);
  }

  ngAfterViewInit(): void {
    this.initGraph();
  }
}
