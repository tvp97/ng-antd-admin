
import { Component, OnInit, ChangeDetectionStrategy, ElementRef, OnDestroy, inject, output, viewChild, computed, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { timer } from 'rxjs';

import { fnGetRandomNum } from '@app/utils/tools';
import { ThemeService } from '@store/common-store/theme.service';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzCardModule, NzTypographyModule, NzGridModule, NzAvatarModule, NzResultModule, NzIconModule, NzButtonModule, FormsModule, ReactiveFormsModule, NzInputModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  readonly myScrollContainer = viewChild.required<ElementRef>('scrollMe');
  readonly changeShows = output<boolean>();
  validateForm!: FormGroup;
  messageArray = signal<Array<{ msg: string; dir: 'left' | 'right'; isReaded: boolean }>>([]);
  isSending = signal(false);
  show = false;
  randomReport: string[] = [
    'Xin lỗi, tôi bây giờ có việc không có ở đây Lát nữa cũng không muốn để ý đến bạn',
    'Xin chào, gửi phong bao 1 tệ để tự động mở khóa chế độ trò chuyện',
    'Xin chào, bây giờ tôi không chán Hy vọng khi buồn chán bạn sẽ tìm đến tôi',
    'Cưng của bạn đang vội vàng trong vòng tám trăm dặm để đến giao diện trò chuyện của bạn',
    'Tôi tỉnh dậy giữa lúc đang chợp mắt ở lâu đài ma thuật để trả lời bạn',
    'Tuyến riêng lâu đài ma thuật Gulu Gulu đang kết nối cho bạn',
    'Đừng làm phiền tôi nhé, tôi đang thổi bong bóngOooooo',
    'Cửa hàng đồ cổ của bố già, có việc xin để lại lời nhắn',
    'Tôi không về là đi nhổ củ cải rồiOoo',
    'Tôi không thích trả lời tin nhắn, cảm giác như kiếp trước tôi là một cái không làm phiền',
    'Dịch vụ nhân tạo xin nhấn1',
    'Hiện tại sản phẩm Tâm Động đã bán hết, chào mừng bạn lần sau ghé thăm',
    'Đi ra ngoài vũ trụ hái sao rồi, sẽ về ngay',
    'Đừng tìm tôi, có việc thì chuyển tiền',
    'Xin chào, tôi là trả lời tự động, người mà bạn đang trò chuyện hiện không có mặt',
    'Bạn có thể trò chuyện với tôi, nhưng tôi cũng chỉ biết câu này thôi',
    'Làm gì đấy, tôi là ông nội bò của bạn',
    'Chúc mừng bạn đã mở khóa em nhỏ đáng yêu của tôi',
    'Tôi đi mua vài quả quýt, bạn cứ ở đây, đừng đi đâu cả',
    'Tôi đi làm cho Hỷ Chi Lang rồi, về sẽ mang phi hành gia về cho bạn',
    'Đối phương đang cố gắng kết nối với bạn, vui lòng chờ, tiến độ hiện tại1 %',
    'Ối mẹ ơi đau đầu quá, đau đầu quá, không có tiền đóng tiền mạng cũng đau đầu',
    'Chào mừng bạn sử dụng đường dây nóng hài hước, để trò chuyện thủ công vui lòng nhấn1Nhấn để trò chuyện bằng giọng nói2Vui lòng nhấn để trò chuyện video3',
    'Đang hồi chiêu kỹ năng',
    'Tin nhắn của bạn đã được gửi, đối phương đã nhận, nhưng không trả lời',
    'Xin lỗi, người dùng bạn liên hệ quá xuất sắc',
    'Đã bị TencentXóa, muốn tìm hiểuChi tiếtVui lòng tư vấn10086',
    'Đợi tôi một chút, lát nữa tôi sẽ dùng Phương Thiên Hoạ Kích gọt táo cho bạn ăn',
    'Vui lòng nhập520Lần này tôi yêu bạn gọi chính mình',
    'Không trả lời tin nhắn là đang để cừu đi ăn cỏ, mãi không trả lời là cừu bị mất',
    'Ở đây vì đã tiết lộ công thức bí truyền của Crab Burger, Cục Quản lý Hải dương đã bắt giữ cô ấy, khi được thả cô ấy sẽ chủ động liên lạc với bạn',
    'Ừ, bạn tiếp tục nói đi, tôi đang nghe đây',
    'Bạn là điều tuyệt vời chỉ có vào mùa hè',
    'Sẽ phản hồi trong thời gian thưởng thức',
    'Trên đường vội vã đến gặp bạn',
    'Alo, đây là nhà hàng Crab Burger King ở bãi biển Bikini, tôi đang rán miếng thịt trong siêu bánh cua trứng cá cua.',
    'Có việc gì thì tìm anh Bạch Tuộc, bù bù bù bù bù',
    'Tôi vàxxĐi làm phi hành gia, về sẽ bắt người ngoài hành tinh cho bạn',
    'Chết đuối trong biển học',
    'Tôi và yêu quái già Hắc Sơn đi lên núi sau thảo luận về việc ăn Đường Tăng, có việc sẽ nói khi quay về.',
    'Làm gì?',
    'Nói lớn hơn một chút! Tôi nghe không rõ!',
    'Không quay lại nghĩa là đang ở trong hẻm núi',
    'Mãi không trả lời tức là đã bị chôn trong hẻm núi',
    'Không trả lời nghĩa là đang chơi PUBG',
    'Không trả lời mãi là bị gà ăn rồi',
    'Tôi đã đi vũ trụ',
    'Về nhà hái sao cho bạn',
    'Xin chào',
    'Ông lớn của chúng tôi đang cứu vũ trụ',
    'Đánh xong quái vật thì quay lại',
    'Đợi một chút, bạn sẽ gặp anh ấy ngay thôi',
    'Chủ nhân nói muốn biết tung tích cô ấy cần một gói khoai tây chiên vị cà chua',
    'Những con cá, chủ ao đi ra rải lưới, trở về để ưu ái các bạn',
    'Có chuyện gì để tối nói, trường mầm non còn chưa tan học',
    'Quý khách vui lòng chờ một chút, chủ nhân đang trên đường',
    'Không trả lời tin nhắn tức là đang xin tiền',
    'Hãy hét ba lần cô gái xinh đẹp, tôi sẽ xuất hiện ngay, nếu không có phản ứng, chứng tỏ không thành thật, hãy hét lại ba lần, cứ tiếp tục như vậy',
    'Cảm ơn',
    'Bạn của bạn đã ngoại tuyến, vui lòng chuyển tiền trước rồi liên hệ',
    'Xin lỗi, đối phương quá dễ thương,',
    'Có việc phải xếp hàng đặt lịch',
    'Tôi đang phơi nắng, đừng làm phiền tôi',
    'Có người phản bội bên trong, hiện giờ không tiện trả lời',
    'Đang tắm',
    'Đối phương đã bị độc, chỉ cần gửi Anh yêu em là có thể giải độc',
    'Mạng của đối phương không ổn định, vui lòng thử lại sau',
    'Để lát nữa hạ phàm gặp mặt các thường dân tục nhân',
    'Đang tu luyện ẩn cư'
  ];
  themeService = inject(ThemeService);
  destroyRef = inject(DestroyRef);

  readonly $themeStyle = computed(() => {
    return this.themeService.$themeStyle();
  });
  private fb = inject(FormBuilder);

  ngOnDestroy(): void {
    console.log('Chức năng chăm sóc khách hàng đã bị hủy');
  }

  close(): void {
    this.changeShows.emit(false);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer().nativeElement.scrollTop = this.myScrollContainer().nativeElement.scrollHeight;
      } catch (err) {
        console.error(err);
      }
    });
  }

  clearMsgInput(): void {
    setTimeout(() => {
      this.validateForm.get('question')?.reset();
    });
  }

  sendMessage(msg: string, event: Event): void {
    if (!msg.trim()) {
      event.preventDefault();
      event.stopPropagation();
      this.clearMsgInput();
      return;
    }
    this.messageArray.update(arr => [...arr, { msg, dir: 'right', isReaded: false }]);
    this.clearMsgInput();

    // Use RxJS timer instead of setTimeout
    timer(1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.isSending.set(true);
      this.messageArray.update(arr =>
        arr.map(item => item.dir === 'right' ? { ...item, isReaded: true } : item)
      );
      // Signal automatically triggers change detection
    });

    timer(3000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const index = fnGetRandomNum(0, this.randomReport.length);
      this.messageArray.update(arr => [...arr, {
        msg: this.randomReport[index],
        dir: 'left',
        isReaded: false
      }]);
      this.isSending.set(false);
      this.scrollToBottom();
      // Signal automatically triggers change detection
    });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      question: [null]
    });
    this.scrollToBottom();
  }
}
