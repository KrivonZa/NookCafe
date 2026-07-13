import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Room } from '../../../models/room.model';

@Component({
  selector: 'app-room-edit-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center text-[var(--color-primary-dark)]">
      <mat-icon class="mr-2 text-[var(--color-primary)]">edit</mat-icon>
      Cập nhật thông tin phòng: {{ data.name }}
    </h2>
    
    <mat-dialog-content class="pt-2">
      <form [formGroup]="roomForm" class="flex flex-col space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Tên phòng</mat-label>
          <input matInput formControlName="name" placeholder="Ví dụ: Espresso Cozy" />
          @if (roomForm.get('name')?.hasError('required')) {
            <mat-error>Tên phòng là bắt buộc</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Sức chứa</mat-label>
            <input matInput formControlName="capacity" placeholder="Ví dụ: 4 – 6 người" />
            @if (roomForm.get('capacity')?.hasError('required')) {
              <mat-error>Sức chứa là bắt buộc</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Giá thuê / giờ (VNĐ)</mat-label>
            <input matInput type="number" formControlName="pricePerHour" placeholder="Ví dụ: 150000" />
            @if (roomForm.get('pricePerHour')?.hasError('required')) {
              <mat-error>Giá thuê là bắt buộc</mat-error>
            }
            @if (roomForm.get('pricePerHour')?.hasError('min')) {
              <mat-error>Giá thuê phải lớn hơn hoặc bằng 0</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Trạng thái</mat-label>
          <mat-select formControlName="status">
            <mat-option value="available">Còn trống</mat-option>
            <mat-option value="active">Hoạt động</mat-option>
            <mat-option value="maintenance">Bảo trì</mat-option>
          </mat-select>
          @if (roomForm.get('status')?.hasError('required')) {
            <mat-error>Trạng thái là bắt buộc</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Đường dẫn ảnh đại diện</mat-label>
          <input matInput formControlName="image" placeholder="URL hình ảnh" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Mô tả phòng</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Nhập mô tả chi tiết phòng..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end" class="space-x-2 pt-4">
      <button mat-button (click)="onCancel()" class="cafe-btn-outline">Hủy</button>
      <button 
        mat-flat-button 
        class="cafe-btn-primary" 
        [disabled]="roomForm.invalid"
        (click)="onSave()"
      >
        Lưu thay đổi
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomEditDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<RoomEditDialogComponent>);
  readonly data: Room = inject(MAT_DIALOG_DATA);

  roomForm!: FormGroup;

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      name: [this.data.name, Validators.required],
      capacity: [this.data.capacity, Validators.required],
      pricePerHour: [this.data.pricePerHour, [Validators.required, Validators.min(0)]],
      status: [this.data.status, Validators.required],
      image: [this.data.image],
      description: [this.data.description]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.roomForm.valid) {
      this.dialogRef.close({
        ...this.data,
        ...this.roomForm.value
      });
    }
  }
}
