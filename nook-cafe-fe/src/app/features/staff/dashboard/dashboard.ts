import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../../services/room.service';
import { BookingService } from '../../../services/booking.service';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    StatusChipComponent,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    DatePipe
  ],
  template: `
    <div class="space-y-8">
      
      <!-- Dashboard Title -->
      <div>
        <h2 class="text-2xl font-bold font-title text-[var(--color-primary-dark)]">Tổng quan hôm nay</h2>
        <p class="text-sm text-[var(--color-text-muted)]">Số liệu và hoạt động đặt phòng mới nhất</p>
      </div>

      <!-- Summary KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- KPI Card 1: Today Bookings -->
        <mat-card class="p-6 flex items-center justify-between !border-l-4 !border-l-[var(--color-primary)]">
          <div class="space-y-1">
            <span class="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Đơn hôm nay</span>
            <div class="text-3xl font-extrabold text-[var(--color-primary-dark)] font-title">
              {{ todayBookingsCount() }}
            </div>
          </div>
          <span class="p-3 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-full">
            <mat-icon class="!h-6 !w-6 !text-[24px]">receipt_long</mat-icon>
          </span>
        </mat-card>

        <!-- KPI Card 2: Active Rooms -->
        <mat-card class="p-6 flex items-center justify-between !border-l-4 !border-l-[var(--color-accent)]">
          <div class="space-y-1">
            <span class="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Phòng hoạt động</span>
            <div class="text-3xl font-extrabold text-[var(--color-primary-dark)] font-title">
              {{ activeRoomsCount() }}
            </div>
          </div>
          <span class="p-3 bg-amber-50 text-[var(--color-accent)] rounded-full">
            <mat-icon class="!h-6 !w-6 !text-[24px]">meeting_room</mat-icon>
          </span>
        </mat-card>

        <!-- KPI Card 3: Pending Confirmations -->
        <mat-card class="p-6 flex items-center justify-between !border-l-4 !border-l-amber-500">
          <div class="space-y-1">
            <span class="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Đơn chờ xác nhận</span>
            <div class="text-3xl font-extrabold text-[var(--color-primary-dark)] font-title">
              {{ pendingBookingsCount() }}
            </div>
          </div>
          <span class="p-3 bg-amber-50 text-amber-600 rounded-full">
            <mat-icon class="!h-6 !w-6 !text-[24px]">hourglass_empty</mat-icon>
          </span>
        </mat-card>

      </div>

      <!-- Recent Bookings Table Section -->
      <mat-card class="p-6 border border-[rgba(123,94,87,0.06)] shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold font-title text-[var(--color-primary-dark)]">Danh sách đặt phòng gần đây</h3>
          <a mat-button routerLink="/staff/bookings" class="cafe-btn-outline font-title text-sm border-[rgba(123,94,87,0.15)] text-[var(--color-primary)]">
            Xem tất cả lịch
          </a>
        </div>

        <div class="overflow-x-auto rounded-[var(--radius-md)] border border-gray-100">
          <table mat-table [dataSource]="recentBookings()" class="w-full !bg-white">
            <!-- Customer Column -->
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Khách hàng</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm font-medium">
                {{ element.customerName }}
                <span class="block text-xs text-[var(--color-text-muted)] font-normal">{{ element.phone }}</span>
              </td>
            </ng-container>

            <!-- Room Column -->
            <ng-container matColumnDef="room">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Phòng</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm text-[var(--color-primary)] font-semibold">
                {{ element.roomName }}
              </td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Ngày</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm text-[var(--color-text-muted)]">
                {{ element.date | date:'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <!-- Time Column -->
            <ng-container matColumnDef="time">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Khung giờ</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm font-semibold text-[var(--color-text-dark)]">
                {{ element.timeSlot }}
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Trạng thái</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b">
                <app-status-chip [status]="element.status" type="booking"></app-status-chip>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50/50"></tr>
          </table>
        </div>
      </mat-card>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly roomService = inject(RoomService);
  private readonly bookingService = inject(BookingService);

  displayedColumns: string[] = ['customer', 'room', 'date', 'time', 'status'];

  // Today Date string YYYY-MM-DD
  private getTodayStr(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Count bookings scheduled for today
  todayBookingsCount = computed(() => {
    const today = this.getTodayStr();
    return this.bookingService.bookings().filter(b => b.date === today).length;
  });

  // Count active rooms (status 'active' or 'available')
  activeRoomsCount = computed(() => {
    return this.roomService.rooms().filter(r => r.status === 'active' || r.status === 'available').length;
  });

  // Count pending bookings
  pendingBookingsCount = computed(() => {
    return this.bookingService.bookings().filter(b => b.status === 'pending').length;
  });

  // Top 5 most recent bookings
  recentBookings = computed(() => {
    return this.bookingService.bookings().slice(0, 5);
  });
}
