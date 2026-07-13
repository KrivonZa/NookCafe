import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/room.model';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-staff-bookings',
  standalone: true,
  imports: [
    CommonModule,
    StatusChipComponent,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    DatePipe
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Page Title -->
      <div>
        <h2 class="text-2xl font-bold font-title text-[var(--color-primary-dark)]">Quản lý lịch đặt phòng</h2>
        <p class="text-sm text-[var(--color-text-muted)]">Xem, duyệt hoặc hủy các yêu cầu đặt phòng họp của khách hàng</p>
      </div>

      <!-- Bookings Table -->
      <mat-card class="p-6 border border-[rgba(123,94,87,0.06)] shadow-sm">
        <div class="overflow-x-auto rounded-[var(--radius-md)] border border-gray-100">
          <table mat-table [dataSource]="bookings()" class="w-full !bg-white">
            
            <!-- Customer Column -->
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Khách hàng</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm font-medium">
                {{ element.customerName }}
                <span class="block text-xs text-[var(--color-text-muted)] font-normal">{{ element.email }}</span>
              </td>
            </ng-container>

            <!-- Phone Column -->
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Số điện thoại</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm text-[var(--color-text-dark)]">
                {{ element.phone }}
              </td>
            </ng-container>

            <!-- Room Column -->
            <ng-container matColumnDef="room">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Phòng họp</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm text-[var(--color-primary)] font-semibold">
                {{ element.roomName }}
              </td>
            </ng-container>

            <!-- Date/Time Column -->
            <ng-container matColumnDef="datetime">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Thời gian đặt</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm">
                <span class="font-semibold block text-[var(--color-text-dark)]">{{ element.timeSlot }}</span>
                <span class="text-xs text-[var(--color-text-muted)]">{{ element.date | date:'dd/MM/yyyy' }}</span>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Trạng thái</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b">
                <app-status-chip [status]="element.status" type="booking"></app-status-chip>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b text-center w-48">Hành động</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b text-center space-x-2">
                <!-- Confirm Button -->
                <button 
                  mat-flat-button 
                  [disabled]="element.status !== 'pending'"
                  (click)="confirmBooking(element)"
                  class="bg-emerald-600 hover:bg-emerald-700 text-white !px-3 !py-1 !text-xs !rounded-[var(--radius-sm)]"
                  style="min-width: 70px;"
                >
                  Duyệt
                </button>
                <!-- Cancel Button -->
                <button 
                  mat-flat-button 
                  [disabled]="element.status === 'cancelled'"
                  (click)="cancelBooking(element)"
                  class="bg-rose-600 hover:bg-rose-700 text-white !px-3 !py-1 !text-xs !rounded-[var(--radius-sm)]"
                  style="min-width: 70px;"
                >
                  Hủy đơn
                </button>
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
export class StaffBookingsComponent {
  private readonly bookingService = inject(BookingService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['customer', 'phone', 'room', 'datetime', 'status', 'actions'];

  bookings = computed(() => this.bookingService.bookings());

  confirmBooking(booking: Booking): void {
    const dialogData: ConfirmDialogData = {
      title: 'Xác nhận đặt phòng',
      message: `Bạn có chắc chắn muốn duyệt đơn đặt phòng ${booking.id} của khách hàng ${booking.customerName} không?`,
      confirmText: 'Duyệt đơn',
      cancelText: 'Quay lại',
      isDestructive: false
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((approved: boolean | undefined) => {
      if (approved) {
        this.bookingService.updateBookingStatus(booking.id, 'confirmed');
        this.snackBar.open(`Đã xác nhận đơn đặt phòng ${booking.id}!`, 'Đóng', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  cancelBooking(booking: Booking): void {
    const dialogData: ConfirmDialogData = {
      title: 'Hủy lịch đặt phòng',
      message: `Bạn có chắc chắn muốn hủy đơn đặt phòng ${booking.id} của khách hàng ${booking.customerName}? Thao tác này không thể hoàn tác.`,
      confirmText: 'Hủy đơn',
      cancelText: 'Quay lại',
      isDestructive: true
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((approved: boolean | undefined) => {
      if (approved) {
        this.bookingService.updateBookingStatus(booking.id, 'cancelled');
        this.snackBar.open(`Đã hủy đơn đặt phòng ${booking.id}!`, 'Đóng', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
