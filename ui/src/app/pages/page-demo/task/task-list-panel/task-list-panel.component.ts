import { Component, signal, computed, inject } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { ModalBtnStatus } from '@widget/base-modal';
import { TaskModalService } from '@widget/biz-widget/task/task-modal.service';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule } from '@angular/forms';

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags?: string[];
  assignee?: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}

@Component({
  selector: 'app-task-list-panel',
  imports: [DragDropModule, FormsModule, NzCardModule, NzIconModule, NzTagModule, NzButtonModule, NzInputModule, NzBadgeModule, NzEmptyModule, NzTooltipModule],
  templateUrl: './task-list-panel.component.html',
  styleUrl: './task-list-panel.component.less'
})
export class TaskListPanelComponent {
  searchKeyword = signal('');
  private taskModalService = inject(TaskModalService);

  columns = signal<Column[]>([
    {
      id: 'todo',
      title: 'Chưa bắt đầu',
      color: '#8c8c8c',
      tasks: [
        {
          id: 1,
          title: 'Kubernetes cluster meeting',
          description: 'Thảo luận về phương án mở rộng cụm và cấu hình cảnh báo giám sát',
          status: 'todo',
          priority: 'high',
          dueDate: '2026-03-22',
          tags: ['DevOps', 'K8s'],
          assignee: 'Alice'
        },
        {
          id: 4,
          title: 'Sửa lỗi bố cục trên thiết bị di động',
          status: 'todo',
          priority: 'medium',
          dueDate: '2026-03-23',
          tags: ['Bug', 'Mobile']
        },
        {
          id: 5,
          title: 'mã Review: Mô-đun thanh toán',
          status: 'todo',
          priority: 'low',
          dueDate: '2026-03-28',
          tags: ['Review'],
          assignee: 'Dave'
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'Đang tiến hành',
      color: '#1890ff',
      tasks: [
        {
          id: 2,
          title: 'Hoàn thành Angular Tái cấu trúc quản lý trạng thái tín hiệu',
          description: 'Di chuyển các thành phần hiện có sang signal-based Quản lý trạng thái',
          status: 'in-progress',
          priority: 'high',
          dueDate: '2026-03-25',
          tags: ['Frontend', 'Angular'],
          assignee: 'Bob'
        },
        {
          id: 6,
          title: 'Thiết kế trang đăng nhập phiên bản mới',
          description: 'Tham khảo Figma Bản thảo hoàn thành bố cục phản hồi',
          status: 'in-progress',
          priority: 'medium',
          dueDate: '2026-03-24',
          tags: ['UI'],
          assignee: 'Carol'
        }
      ]
    },
    {
      id: 'done',
      title: 'Đã hoàn thành',
      color: '#52c41a',
      tasks: [
        {
          id: 3,
          title: 'Cập nhật API Tài liệu',
          description: 'Bổ sungThêm mớigiao diện Swagger Chú thích',
          status: 'done',
          priority: 'medium',
          dueDate: '2026-03-20',
          tags: ['Docs'],
          assignee: 'Carol'
        }
      ]
    }
  ]);

  columnIds = computed(() => this.columns().map(c => c.id));

  // Cột đã lọc (theoTìm kiếmTừ khóa)
  filteredColumns = computed(() => {
    const keyword = this.searchKeyword().toLowerCase().trim();
    if (!keyword) return this.columns();

    return this.columns().map(col => ({
      ...col,
      tasks: col.tasks.filter(
        task =>
          task.title.toLowerCase().includes(keyword) ||
          task.description?.toLowerCase().includes(keyword) ||
          task.tags?.some(tag => tag.toLowerCase().includes(keyword)) ||
          task.assignee?.toLowerCase().includes(keyword)
      )
    }));
  });

  priorityColor: Record<TaskPriority, string> = {
    high: 'red',
    medium: 'orange',
    low: 'default'
  };

  priorityLabel: Record<TaskPriority, string> = {
    high: 'khẩn cấp',
    medium: 'Trung bình',
    low: 'Bình thường'
  };

  drop(event: CdkDragDrop<Task[]>, targetColId: TaskStatus) {
    const cols = this.columns();
    const fromColId = event.previousContainer.id as TaskStatus;
    const toColId = targetColId;

    if (fromColId === toColId) {
      // Sắp xếp theo cột
      this.columns.update(list =>
        list.map(col => {
          if (col.id !== fromColId) return col;
          const tasks = [...col.tasks];
          moveItemInArray(tasks, event.previousIndex, event.currentIndex);
          return { ...col, tasks };
        })
      );
    } else {
      // Di chuyển qua các hàng
      const fromCol = cols.find(c => c.id === fromColId)!;
      const toCol = cols.find(c => c.id === toColId)!;
      const fromTasks = [...fromCol.tasks];
      const toTasks = [...toCol.tasks];
      transferArrayItem(fromTasks, toTasks, event.previousIndex, event.currentIndex);

      this.columns.update(list =>
        list.map(col => {
          if (col.id === fromColId) return { ...col, tasks: fromTasks };
          if (col.id === toColId) return { ...col, tasks: toTasks.map(t => ({ ...t, status: toColId })) };
          return col;
        })
      );
    }
  }

  openAddTaskModal() {
    this.taskModalService.show({ nzTitle: 'Thêm mớinhiệm vụ' }).subscribe(res => {
      if (res.status === ModalBtnStatus.Ok) {
        const formValue = res.modalValue;
        const task: Task = {
          id: Date.now(),
          title: formValue.title,
          description: formValue.description,
          status: 'todo',
          priority: formValue.priority,
          tags: formValue.tags?.length > 0 ? formValue.tags : undefined,
          assignee: formValue.assignee,
          dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString().split('T')[0] : undefined
        };
        this.columns.update(list => list.map(col => (col.id === 'todo' ? { ...col, tasks: [task, ...col.tasks] } : col)));
      }
    });
  }

  openEditTaskModal(colId: TaskStatus, task: Task) {
    this.taskModalService
      .show(
        { nzTitle: 'Sửanhiệm vụ' },
        {
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          tags: task.tags,
          assignee: task.assignee,
          dueDate: task.dueDate
        }
      )
      .subscribe(res => {
        if (res.status === ModalBtnStatus.Ok) {
          const formValue = res.modalValue;
          this.columns.update(list =>
            list.map(col => {
              if (col.id !== colId) return col;
              return {
                ...col,
                tasks: col.tasks.map(t =>
                  t.id === task.id
                    ? {
                        ...t,
                        title: formValue.title,
                        description: formValue.description,
                        priority: formValue.priority,
                        tags: formValue.tags?.length > 0 ? formValue.tags : undefined,
                        assignee: formValue.assignee,
                        dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString().split('T')[0] : undefined
                      }
                    : t
                )
              };
            })
          );
        }
      });
  }

  deleteTask(colId: TaskStatus, taskId: number) {
    this.columns.update(list => list.map(col => (col.id === colId ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) } : col)));
  }

  isOverdue(dueDate?: string): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
  }

  isToday(dueDate?: string): boolean {
    if (!dueDate) return false;
    return dueDate === new Date().toISOString().split('T')[0];
  }
}
