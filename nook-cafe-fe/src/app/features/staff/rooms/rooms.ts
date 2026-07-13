import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RoomService } from '../../../services/room.service';
import { Room } from '../../../models/room.model';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip';
import { RoomEditDialogComponent } from '../../../shared/components/room-edit-dialog/room-edit-dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-staff-rooms',
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
    CurrencyPipe
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Page Title -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold font-title text-[var(--color-primary-dark)]">Quản lý phòng họp</h2>
          <p class="text-sm text-[var(--color-text-muted)]">Cập nhật thông tin, bảng giá và trạng thái phòng</p>
        </div>
      </div>

      <!-- Rooms Table -->
      <mat-card class="p-6 border border-[rgba(123,94,87,0.06)] shadow-sm">
        <div class="overflow-x-auto rounded-[var(--radius-md)] border border-gray-100">
          <table mat-table [dataSource]="rooms()" class="w-full !bg-white">
            
            <!-- Image Column -->
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b w-24">Hình ảnh</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b">
                <div class="w-16 h-12 rounded-[var(--radius-sm)] overflow-hidden bg-gray-100">
                  <img [src]="element.image" [alt]="element.name" class="object-cover w-full h-full" />
                </div>
              </td>
            </ng-container>

            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Tên phòng</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm font-semibold text-[var(--color-primary-dark)]">
                {{ element.name }}
              </td>
            </ng-container>

            <!-- Capacity Column -->
            <ng-container matColumnDef="capacity">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Sức chứa</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm text-[var(--color-text-muted)]">
                {{ element.capacity }}
              </td>
            </ng-container>

            <!-- Price Column -->
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Giá thuê / giờ</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b font-body text-sm font-semibold text-[var(--color-text-dark)]">
                {{ element.pricePerHour | currency:'VND':'symbol-narrow':'1.0-0' }}
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b">Trạng thái</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b">
                <app-status-chip [status]="element.status" type="room"></app-status-chip>
              </td>
            </ng-container>

            <!-- Action Column -->
            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef class="font-title text-sm font-semibold py-4 px-4 bg-gray-50 border-b text-center">Hành động</th>
              <td mat-cell *matCellDef="let element" class="py-4 px-4 border-b text-center">
                <button 
                  mat-icon-button 
                  class="text-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-colors"
                  (click)="openEditDialog(element)"
                  aria-label="Sửa thông tin phòng"
                >
                  <mat-icon>edit</mat-icon>
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
export class StaffRoomsComponent {
  private readonly roomService = inject(RoomService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['image', 'name', 'capacity', 'price', 'status', 'action'];

  rooms = computed(() => this.roomService.rooms());

  openEditDialog(room: Room): void {
    const dialogRef = this.dialog.open(RoomEditDialogComponent, {
      data: { ...room }, // Pass copy of room data
      width: '550px'
    });

    dialogRef.afterClosed().subscribe((result: Room | undefined) => {
      if (result) {
        this.roomService.updateRoom(result.id, result);
        this.snackBar.open(`Cập nhật phòng ${result.name} thành công!`, 'Đóng', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
