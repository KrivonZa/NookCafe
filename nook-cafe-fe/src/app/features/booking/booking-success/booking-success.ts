import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="py-20 bg-[var(--color-cream)] min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full mx-4 bg-white p-8 rounded-[var(--radius-lg)] border border-[rgba(123,94,87,0.06)] shadow-sm text-center">
        
        <!-- Success Icon Ring -->
        <div class="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <mat-icon class="text-emerald-500 !h-10 !w-10 !text-[40px] flex items-center justify-center">check_circle</mat-icon>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold font-title text-[var(--color-primary-dark)] mb-3">
          Đặt phòng thành công!
        </h1>
        
        <p class="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
          Cảm ơn bạn đã lựa chọn Nook Café. Lịch đặt phòng của bạn đã được tiếp nhận và đang chờ duyệt. Chúng tôi sẽ liên hệ xác nhận qua điện thoại hoặc gửi email chi tiết cho bạn trong vòng 10-15 phút.
        </p>

        <div class="space-y-3">
          <a 
            mat-flat-button 
            routerLink="/" 
            class="cafe-btn-primary w-full py-2.5 font-semibold text-sm"
          >
            Quay về trang chủ
          </a>
          <a 
            mat-button 
            routerLink="/rooms" 
            class="cafe-btn-outline w-full py-2.5 font-semibold text-sm border-[rgba(123,94,87,0.15)] text-[var(--color-primary)]"
          >
            Xem danh sách phòng khác
          </a>
        </div>

      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingSuccessComponent {}
