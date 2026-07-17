import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../services/room.service';
import { Room } from '../../../models/room.model';
import { RoomCardComponent } from '../../../shared/components/room-card/room-card';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RoomCardComponent,
    EmptyStateComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="py-12 bg-[var(--color-cream)] min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wider">Danh sách phòng</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-title text-[var(--color-primary-dark)] mt-2">
            Tìm kiếm không gian phù hợp với bạn
          </h1>
          <p class="text-[var(--color-text-muted)] mt-3">
            Lọc theo sức chứa hoặc từ khóa để chọn phòng họp phù hợp nhất cho buổi làm việc tiếp theo.
          </p>
        </div>

        <!-- Filter bar -->
        <div class="bg-white p-6 rounded-[var(--radius-lg)] shadow-sm border border-[rgba(123,94,87,0.06)] mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Search input -->
          <div class="w-full md:flex-grow max-w-lg">
            <mat-form-field appearance="outline" class="w-full !mb-0" subscriptSizing="dynamic">
              <mat-label>Tìm kiếm phòng họp...</mat-label>
              <input 
                matInput 
                [ngModel]="searchQuery()" 
                (ngModelChange)="searchQuery.set($event)" 
                placeholder="Ví dụ: Espresso, Modern..." 
              />
              <mat-icon matSuffix class="text-[var(--color-text-muted)]">search</mat-icon>
            </mat-form-field>
          </div>

          <!-- Filters -->
          <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <mat-form-field appearance="outline" class="w-full sm:w-56 !mb-0" subscriptSizing="dynamic">
              <mat-label>Sức chứa</mat-label>
              <mat-select [ngModel]="selectedCapacity()" (ngModelChange)="selectedCapacity.set($event)">
                <mat-option value="all">Tất cả sức chứa</mat-option>
                <mat-option value="small">Nhóm nhỏ (4 - 6 người)</mat-option>
                <mat-option value="medium">Nhóm vừa (6 - 10 người)</mat-option>
                <mat-option value="large">Nhóm lớn (10 - 15 người)</mat-option>
              </mat-select>
            </mat-form-field>

            <button 
              mat-button 
              (click)="resetFilters()" 
              class="cafe-btn-outline h-14 !px-6 border-[rgba(123,94,87,0.15)] flex items-center justify-center font-title"
            >
              <mat-icon class="mr-1">refresh</mat-icon>
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        <!-- Rooms Grid -->
        @if (filteredRooms().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (room of filteredRooms(); track room.id) {
              <app-room-card [room]="room"></app-room-card>
            }
          </div>
        } @else {
          <app-empty-state 
            icon="search_off" 
            title="Không tìm thấy phòng họp" 
            message="Không tìm thấy kết quả phù hợp với từ khóa hoặc sức chứa được chọn. Vui lòng đặt lại bộ lọc hoặc thay đổi tiêu chí tìm kiếm."
          ></app-empty-state>
        }

      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsListComponent {
  private readonly roomService = inject(RoomService);

  searchQuery = signal<string>('');
  selectedCapacity = signal<string>('all');
  filteredRooms = signal<Room[]>([]);

  constructor() {
    effect(() => {
      const search = this.searchQuery();
      const capacity = this.selectedCapacity();
      this.roomService.searchWorkspaces(search, capacity, false).subscribe({
        next: (rooms) => {
          this.filteredRooms.set(rooms);
        },
        error: (err) => {
          console.error('Error fetching filtered workspaces:', err);
        }
      });
    });
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCapacity.set('all');
  }
}
