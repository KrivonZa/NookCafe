import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../../services/room.service';
import { BookingService } from '../../../services/booking.service';
import { Room, TimeSlot } from '../../../models/room.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    EmptyStateComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <div class="py-10 bg-[var(--color-cream)] min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Back Navigation -->
        <div class="mb-8">
          <a 
            routerLink="/rooms" 
            class="inline-flex items-center text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            <mat-icon class="mr-1">keyboard_backspace</mat-icon>
            Quay lại danh sách phòng
          </a>
        </div>

        @if (room(); as r) {
          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            <!-- Left: Image Gallery -->
            <div class="space-y-4">
              <!-- Active Large Image -->
              <div class="w-full aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden shadow-sm bg-white border border-[rgba(123,94,87,0.06)]">
                <img 
                  [src]="activeImage()" 
                  [alt]="r.name" 
                  class="object-cover w-full h-full"
                />
              </div>
              
              <!-- Thumbnails -->
              <div class="grid grid-cols-3 gap-4">
                @for (img of r.gallery; track img) {
                  <button 
                    (click)="activeImage.set(img)" 
                    class="relative aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border-2 transition-all"
                    [class.border-[var(--color-primary)]]="activeImage() === img"
                    [class.border-transparent]="activeImage() !== img"
                    [class.opacity-70]="activeImage() !== img"
                  >
                    <img [src]="img" [alt]="r.name" class="object-cover w-full h-full" />
                  </button>
                }
              </div>
            </div>

            <!-- Right: Room Details -->
            <div class="space-y-6">
              <div>
                <h1 class="text-3xl sm:text-4xl font-bold font-title text-[var(--color-primary-dark)] leading-tight mb-2">
                  {{ r.name }}
                </h1>
                
                <div class="flex items-center space-x-6 text-sm font-medium mt-3">
                  <span class="inline-flex items-center text-[var(--color-primary)] bg-[var(--color-secondary)] px-3 py-1.5 rounded-full">
                    <mat-icon class="mr-1.5 !h-5 !w-5 !text-[20px]">group</mat-icon>
                    Sức chứa: {{ r.capacity }}
                  </span>
                  <span class="inline-flex items-center text-[var(--color-accent)] bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/40">
                    <mat-icon class="mr-1.5 !h-5 !w-5 !text-[20px]">payments</mat-icon>
                    {{ r.pricePerHour | currency:'VND':'symbol-narrow':'1.0-0' }} / giờ
                  </span>
                </div>
              </div>

              <div class="prose max-w-none text-sm text-[var(--color-text-muted)] leading-relaxed space-y-4">
                <p>{{ r.description }}</p>
              </div>

              <!-- Amenities List -->
              <div class="pt-6 border-t border-[rgba(123,94,87,0.1)]">
                <h3 class="text-base font-bold text-[var(--color-primary-dark)] mb-4">Trang thiết bị phòng họp</h3>
                <div class="grid grid-cols-2 gap-4">
                  @for (amenity of r.amenities; track amenity) {
                    <div class="flex items-center text-sm text-[var(--color-text-dark)] font-medium">
                      <span class="p-1 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-full mr-3 flex items-center justify-center">
                        <mat-icon class="!h-4 !w-4 !text-[16px]">{{ getAmenityIcon(amenity) }}</mat-icon>
                      </span>
                      {{ amenity }}
                    </div>
                  }
                </div>
              </div>
            </div>

          </div>

          <!-- Booking Section -->
          @if (r.status === 'maintenance') {
            <div class="bg-rose-50 border border-rose-200 rounded-[var(--radius-lg)] p-8 text-center max-w-3xl mx-auto">
              <mat-icon class="text-rose-500 !h-12 !w-12 !text-[48px] mb-4">construction</mat-icon>
              <h2 class="text-xl font-bold text-rose-800 font-title mb-2">Phòng đang bảo trì</h2>
              <p class="text-sm text-rose-700 max-w-lg mx-auto">
                Hiện tại phòng <strong>{{ r.name }}</strong> đang trong thời gian bảo trì định kỳ. Quý khách vui lòng chọn phòng họp khác hoặc liên hệ bộ phận hỗ trợ để biết thêm thông tin.
              </p>
              <div class="mt-6">
                <a mat-flat-button routerLink="/rooms" class="cafe-btn-primary">Chọn phòng khác</a>
              </div>
            </div>
          } @else {
            <section class="mt-16 bg-white p-8 rounded-[var(--radius-lg)] border border-[rgba(123,94,87,0.06)] shadow-sm">
              <div class="mb-8">
                <span class="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wider">Đặt phòng họp</span>
                <h2 class="text-2xl sm:text-3xl font-bold font-title text-[var(--color-primary-dark)] mt-1">Đăng ký lịch sử dụng phòng</h2>
                <p class="text-sm text-[var(--color-text-muted)] mt-1">Chọn ngày và khung giờ mong muốn dưới đây.</p>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <!-- Step 1: Calendar Picker -->
                <div>
                  <h3 class="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-3 flex items-center">
                    <span class="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center mr-2 font-title">1</span>
                    Chọn ngày họp
                  </h3>
                  <div class="border border-[rgba(123,94,87,0.1)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream)]">
                    <mat-calendar 
                      [selected]="selectedDate()" 
                      (selectedChange)="onDateSelected($event)"
                      [minDate]="minDate"
                    ></mat-calendar>
                  </div>
                </div>

                <!-- Step 2: Time Slot Picker -->
                <div>
                  <h3 class="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-3 flex items-center">
                    <span class="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center mr-2 font-title">2</span>
                    Chọn khung giờ (Ngày: {{ selectedDate() | date:'dd/MM/yyyy' }})
                  </h3>
                  
                  <div class="grid grid-cols-2 gap-3">
                    @for (slot of timeSlots(); track slot.slot) {
                      <button 
                        [disabled]="!slot.available"
                        (click)="selectedSlot.set(slot.slot)"
                        [class]="getTimeSlotClasses(slot)"
                      >
                        <mat-icon class="mr-1 text-xs !w-4 !h-4 !text-[16px]">
                          {{ !slot.available ? 'lock' : (selectedSlot() === slot.slot ? 'check_circle' : 'schedule') }}
                        </mat-icon>
                        <span class="font-body text-xs font-semibold">{{ slot.slot }}</span>
                      </button>
                    }
                  </div>

                  @if (!selectedSlot()) {
                    <p class="text-xs text-rose-500 font-medium mt-3 flex items-center">
                      <mat-icon class="mr-1 text-xs !w-4 !h-4 !text-[16px]">info</mat-icon>
                      Vui lòng chọn một khung giờ còn trống để tiếp tục đặt lịch.
                    </p>
                  }
                </div>
              </div>

              <!-- Step 3: Reactive Booking Form -->
              @if (selectedSlot()) {
                <div class="mt-12 pt-10 border-t border-[rgba(123,94,87,0.1)] max-w-3xl mx-auto">
                  <h3 class="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-6 flex items-center">
                    <span class="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center mr-2 font-title">3</span>
                    Thông tin liên hệ đặt phòng
                  </h3>

                  <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Họ và tên</mat-label>
                        <input matInput formControlName="customerName" placeholder="Nguyễn Văn A" />
                        @if (bookingForm.get('customerName')?.hasError('required')) {
                          <mat-error>Họ và tên là bắt buộc</mat-error>
                        }
                      </mat-form-field>

                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Số điện thoại</mat-label>
                        <input matInput formControlName="phone" placeholder="0912345678" />
                        @if (bookingForm.get('phone')?.hasError('required')) {
                          <mat-error>Số điện thoại là bắt buộc</mat-error>
                        }
                        @if (bookingForm.get('phone')?.hasError('pattern')) {
                          <mat-error>Số điện thoại không hợp lệ (10 chữ số)</mat-error>
                        }
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Email</mat-label>
                      <input matInput formControlName="email" type="email" placeholder="email&#64;gmail.com" />
                      @if (bookingForm.get('email')?.hasError('required')) {
                        <mat-error>Email là bắt buộc</mat-error>
                      }
                      @if (bookingForm.get('email')?.hasError('email')) {
                        <mat-error>Email không hợp lệ</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Ghi chú thêm (Không bắt buộc)</mat-label>
                      <textarea matInput formControlName="notes" rows="3" placeholder="Ví dụ: Chuẩn bị trà ấm, cần bảng viết di động..."></textarea>
                    </mat-form-field>

                    <!-- Summary Box -->
                    <div class="bg-[var(--color-secondary)] p-5 rounded-[var(--radius-md)] border border-[rgba(123,94,87,0.1)] text-sm space-y-2">
                      <h4 class="font-title font-semibold text-[var(--color-primary-dark)]">Tóm tắt đặt phòng</h4>
                      <div class="grid grid-cols-2 gap-1 text-[var(--color-text-muted)]">
                        <span>Phòng họp:</span>
                        <strong class="text-[var(--color-text-dark)]">{{ r.name }}</strong>
                        <span>Thời gian:</span>
                        <strong class="text-[var(--color-text-dark)]">{{ selectedSlot() }}</strong>
                        <span>Ngày đặt:</span>
                        <strong class="text-[var(--color-text-dark)]">{{ selectedDate() | date:'dd/MM/yyyy' }}</strong>
                        <span>Chi phí (ước tính):</span>
                        <strong class="text-[var(--color-primary)] font-title text-base">
                          {{ r.pricePerHour * 2 | currency:'VND':'symbol-narrow':'1.0-0' }} (2 giờ)
                        </strong>
                      </div>
                    </div>

                    <div class="flex flex-col items-center pt-2">
                      <button 
                        mat-flat-button 
                        type="submit" 
                        class="cafe-btn-primary w-full md:w-56 text-lg py-3"
                        [disabled]="bookingForm.invalid || isSubmitting()"
                      >
                        @if (isSubmitting()) {
                          <span>Đang xử lý...</span>
                        } @else {
                          <span>Đặt phòng</span>
                        }
                      </button>
                      
                      <!-- Placeholders for API Errors -->
                      <p class="text-xs text-[var(--color-text-muted)] mt-2">
                        Xác nhận đặt phòng sẽ được xử lý lập tức.
                      </p>
                    </div>
                  </form>
                </div>
              }
            </section>
          }
        } @else {
          <app-empty-state 
            icon="sentiment_dissatisfied" 
            title="Không tìm thấy phòng họp" 
            message="Xin lỗi, phòng họp bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
          ></app-empty-state>
        }

      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly roomService = inject(RoomService);
  private readonly bookingService = inject(BookingService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  room = signal<Room | null>(null);
  activeImage = signal<string>('');
  selectedDate = signal<Date>(new Date());
  selectedSlot = signal<string>('');
  isSubmitting = signal(false);
  minDate = new Date();

  bookingForm!: FormGroup;

  // Fetch available slots dynamically
  timeSlots = computed<TimeSlot[]>(() => {
    const r = this.room();
    if (!r) return [];

    const d = this.selectedDate();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    return this.bookingService.getTimeSlotsForRoomAndDate(r.id, dateStr);
  });

  ngOnInit(): void {
    // Get ID parameter
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.roomService.getWorkspaceDetails(Number(idParam)).subscribe({
        next: (roomObj) => {
          this.room.set(roomObj);
          this.activeImage.set(roomObj.image);
        },
        error: (err) => {
          console.error('Error loading room detail from API:', err);
          // Fallback to local service cache
          const roomObj = this.roomService.getRoomById(Number(idParam));
          if (roomObj) {
            this.room.set(roomObj);
            this.activeImage.set(roomObj.image);
          }
        }
      });
    }

    // Build form
    this.bookingForm = this.fb.group({
      customerName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      notes: ['']
    });
  }

  onDateSelected(date: Date | null): void {
    if (date) {
      this.selectedDate.set(date);
      this.selectedSlot.set(''); // Clear selected slot on date change
    }
  }

  getTimeSlotClasses(slot: TimeSlot): string {
    const base = 'flex items-center justify-center p-3.5 rounded-[var(--radius-md)] border text-left transition-all w-full ';
    if (!slot.available) {
      return base + 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
    }
    if (this.selectedSlot() === slot.slot) {
      return base + 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm';
    }
    return base + 'bg-white hover:bg-[var(--color-secondary)] text-[var(--color-text-dark)] border-[rgba(123,94,87,0.15)]';
  }

  getAmenityIcon(amenity: string): string {
    const a = amenity.toLowerCase();
    if (a.includes('wifi')) return 'wifi';
    if (a.includes('chiếu')) return 'videocam';
    if (a.includes('tv')) return 'tv';
    if (a.includes('điều hòa')) return 'ac_unit';
    if (a.includes('cà phê')) return 'local_cafe';
    if (a.includes('in ấn')) return 'print';
    if (a.includes('âm thanh') || a.includes('loa')) return 'volume_up';
    if (a.includes('ổ cắm') || a.includes('điện')) return 'power';
    return 'edit';
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.selectedSlot() || !this.room()) {
      return;
    }

    this.isSubmitting.set(true);

    const d = this.selectedDate();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const formValues = this.bookingForm.value;
    const roomObj = this.room()!;

    // Simulate network delay
    setTimeout(() => {
      try {
        this.bookingService.createBooking({
          customerName: formValues.customerName,
          phone: formValues.phone,
          email: formValues.email,
          notes: formValues.notes,
          roomId: roomObj.id,
          roomName: roomObj.name,
          date: dateStr,
          timeSlot: this.selectedSlot()
        });

        this.snackBar.open('Đặt phòng thành công!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        this.router.navigate(['/booking-success']);
      } catch (err) {
        this.isSubmitting.set(false);
      }
    }, 1200);
  }
}
