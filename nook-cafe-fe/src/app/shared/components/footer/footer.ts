import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <footer
      class="bg-[var(--color-primary-dark)] text-[var(--color-secondary)] pt-16 pb-8 border-t border-[rgba(123,94,87,0.2)]"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12"
      >
        <!-- About / Brand Info -->
        <div class="space-y-4">
          <div>
            <img
              src="/homepage/light-horizontal-logo.png"
              alt="Nook Café Logo"
              class="h-22 md:h-24 w-auto"
            />
          </div>
          <p class="text-sm text-gray-300 leading-relaxed max-w-sm">
            Nook Café cung cấp không gian họp hiện đại, chuyên nghiệp tích hợp trong môi trường quán
            cà phê yên tĩnh và ấm cúng. Nơi ý tưởng lớn gặp gỡ.
          </p>
        </div>

        <!-- Working Hours & Quick Links -->
        <div class="space-y-4">
          <h4 class="font-title text-base font-semibold text-white tracking-wide uppercase">
            Giờ làm việc
          </h4>
          <ul class="text-sm text-gray-300 space-y-2">
            <li class="flex justify-between max-w-xs">
              <span>Thứ Hai - Thứ Sáu:</span>
              <span class="font-medium text-white">07:00 - 22:00</span>
            </li>
            <li class="flex justify-between max-w-xs">
              <span>Thứ Bảy - Chủ Nhật:</span>
              <span class="font-medium text-white">08:00 - 23:00</span>
            </li>
          </ul>
        </div>

        <!-- Contact & Location -->
        <div class="space-y-4">
          <h4 class="font-title text-base font-semibold text-white tracking-wide uppercase">
            Liên hệ
          </h4>
          <ul class="text-sm text-gray-300 space-y-3">
            <li class="flex items-start">
              <mat-icon class="mr-2 text-[var(--color-accent)] !h-5 !w-5 !text-[20px]"
                >place</mat-icon
              >
              <span>123 Đường Tố Hữu, Quận Nam Từ Liêm, Hà Nội</span>
            </li>
            <li class="flex items-center">
              <mat-icon class="mr-2 text-[var(--color-accent)] !h-5 !w-5 !text-[20px]"
                >phone</mat-icon
              >
              <span>+84 24 3789 2222</span>
            </li>
            <li class="flex items-center">
              <mat-icon class="mr-2 text-[var(--color-accent)] !h-5 !w-5 !text-[20px]"
                >email</mat-icon
              >
              <span>hello&#64;nookcafe.com</span>
            </li>
            <li class="pt-1">
              <a
                routerLink="/staff/login"
                class="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-sm text-gray-200 transition hover:border-[var(--color-accent)] hover:text-white"
              >
                <mat-icon class="mr-2 !h-4 !w-4 !text-[16px] text-[var(--color-accent)]"
                  >login</mat-icon
                >
                <span>Đăng nhập</span>
              </a>
            </li>
          </ul>
          <div class="flex space-x-4 pt-2">
            <a
              href="#"
              class="text-gray-300 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <span
                class="p-2 bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] rounded-full flex items-center justify-center"
              >
                <mat-icon class="!h-5 !w-5 !text-[20px]">facebook</mat-icon>
              </span>
            </a>
            <a
              href="#"
              class="text-gray-300 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <span
                class="p-2 bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] rounded-full flex items-center justify-center"
              >
                <mat-icon class="!h-5 !w-5 !text-[20px]">photo_camera</mat-icon>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[rgba(255,255,255,0.06)] pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400"
      >
        <p>&copy; 2026 Nook Café. All rights reserved.</p>
        <p class="mt-2 sm:mt-0">Designed by the Nook Café Team</p>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
