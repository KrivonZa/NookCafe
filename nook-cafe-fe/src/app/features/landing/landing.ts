import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { RoomCardComponent } from '../../shared/components/room-card/room-card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, RoomCardComponent, MatButtonModule, MatIconModule],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-[var(--color-primary-dark)] text-white overflow-hidden py-24 sm:py-32">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img 
          src="/homepage/hero.png"
          alt="Nook Café Hero Banner"
          class="object-cover w-full h-full"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary-dark)]/60 to-transparent"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--color-accent)] text-white mb-4">
            Chào mừng tới Nook Café
          </span>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold font-title text-white leading-tight mb-6">
            Không gian lý tưởng<br />cho mọi cuộc họp.
          </h1>
          <p class="text-lg sm:text-xl text-gray-200 leading-relaxed font-body mb-8">
            Đặt phòng họp theo giờ trong không gian cà phê hiện đại, yên tĩnh, đầy đủ tiện nghi thiết bị và nước uống chất lượng cao.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a 
              mat-flat-button 
              routerLink="/rooms" 
              class="cafe-btn-accent text-lg px-8 py-3.5"
            >
              Đặt phòng ngay
            </a>
            <a 
              mat-flat-button 
              (click)="scrollToAbout()"
              class="cafe-btn-outline border-white text-white bg-white/10 hover:bg-white/20 text-lg px-8 py-3.5 cursor-pointer"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Amenities Section -->
    <section class="py-20 bg-white border-b border-[rgba(123,94,87,0.06)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wider">Tiện ích đi kèm</span>
          <h2 class="text-3xl font-bold font-title text-[var(--color-primary-dark)] mt-2">Dịch vụ chuẩn mực chuyên nghiệp</h2>
          <p class="text-[var(--color-text-muted)] mt-4">Mọi đặt phòng đều được chuẩn bị chu đáo với các trang thiết bị hiện đại nhất, giúp buổi làm việc của bạn diễn ra suôn sẻ.</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
          @for (amenity of amenities; track amenity.name) {
            <div class="flex flex-col items-center justify-center p-6 bg-[var(--color-cream)] rounded-[var(--radius-lg)] border border-[rgba(123,94,87,0.05)] shadow-sm hover:shadow-md transition-shadow text-center">
              <span class="p-3 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-full mb-4 flex items-center justify-center">
                <mat-icon class="!h-7 !w-7 !text-[28px]">{{ amenity.icon }}</mat-icon>
              </span>
              <h3 class="font-title text-sm font-semibold text-[var(--color-primary-dark)]">{{ amenity.name }}</h3>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Featured Meeting Rooms -->
    <section class="py-20 bg-[var(--color-cream)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span class="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wider">Không gian họp</span>
            <h2 class="text-3xl font-bold font-title text-[var(--color-primary-dark)] mt-2">Các phòng họp nổi bật</h2>
          </div>
          <a 
            mat-button 
            routerLink="/rooms" 
            class="cafe-btn-outline mt-4 md:mt-0"
          >
            <span>Xem tất cả phòng</span>
            <mat-icon class="ml-1">arrow_right_alt</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (room of featuredRooms(); track room.id) {
            <app-room-card [room]="room"></app-room-card>
          }
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <!-- Image grid -->
          <div class="relative flex justify-center">
            <div class="relative w-full max-w-md aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden shadow-lg z-10">
              <img 
                src="/homepage/interior.png" 
                alt="Nook Café Interior" 
                class="object-cover w-full h-full"
              />
            </div>
            <!-- Decorative beige backplate -->
            <div class="absolute -top-6 -left-6 w-48 h-48 bg-[var(--color-secondary)] rounded-[var(--radius-lg)] -z-0 hidden sm:block"></div>
            <div class="absolute -bottom-6 -right-6 w-48 h-48 bg-[var(--color-secondary)] rounded-[var(--radius-lg)] -z-0 hidden sm:block"></div>
          </div>

          <!-- Description -->
          <div class="space-y-6">
            <span class="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wider">Về chúng tôi</span>
            <h2 class="text-3xl font-bold font-title text-[var(--color-primary-dark)]">Khám phá Nook Café</h2>
            <p class="text-[var(--color-text-muted)] font-body leading-relaxed">
              Nook Café được thành lập với mục tiêu giải quyết bài toán tìm kiếm không gian họp chất lượng cho các freelancer, nhóm làm việc tự do và doanh nghiệp nhỏ. Chúng tôi tin rằng một ly cà phê tuyệt hảo kết hợp với một phòng họp yên tĩnh, đầy đủ công nghệ sẽ mang lại hiệu suất tối đa cho công việc của bạn.
            </p>
            <p class="text-[var(--color-text-muted)] font-body leading-relaxed">
              Từ hệ thống cách âm cao cấp, đường truyền internet tốc độ cao chuyên biệt cho đến thực đơn nước uống đa dạng phục vụ tận bàn, Nook Café cam kết mang đến trải nghiệm tuyệt vời nhất cho quý khách hàng.
            </p>
            <div class="pt-4">
              <div class="flex items-center space-x-6">
                <div class="flex flex-col">
                  <span class="text-3xl font-extrabold text-[var(--color-primary)] font-title">4+</span>
                  <span class="text-xs text-[var(--color-text-muted)] font-medium">Phòng họp riêng tư</span>
                </div>
                <div class="border-l border-gray-300 h-10"></div>
                <div class="flex flex-col">
                  <span class="text-3xl font-extrabold text-[var(--color-primary)] font-title">100%</span>
                  <span class="text-xs text-[var(--color-text-muted)] font-medium">Hài lòng từ khách hàng</span>
                </div>
                <div class="border-l border-gray-300 h-10"></div>
                <div class="flex flex-col">
                  <span class="text-3xl font-extrabold text-[var(--color-primary)] font-title">24/7</span>
                  <span class="text-xs text-[var(--color-text-muted)] font-medium">Hỗ trợ đặt lịch online</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  private readonly roomService = inject(RoomService);

  featuredRooms = computed(() => {
    // Show top 3 available or active rooms
    return this.roomService.rooms().slice(0, 3);
  });

  amenities = [
    { name: 'Wifi tốc độ cao', icon: 'wifi' },
    { name: 'Máy chiếu sắc nét', icon: 'videocam' },
    { name: 'Smart TV lớn', icon: 'tv' },
    { name: 'Điều hòa mát lạnh', icon: 'ac_unit' },
    { name: 'Cà phê miễn phí', icon: 'local_cafe' }
  ];

  scrollToAbout(): void {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
