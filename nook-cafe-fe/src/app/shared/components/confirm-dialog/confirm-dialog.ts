import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="flex items-center text-[var(--color-primary-dark)]">
      <mat-icon class="mr-2 text-[var(--color-accent)]">info</mat-icon>
      {{ data.title }}
    </h2>
    <mat-dialog-content class="text-sm text-[var(--color-text-muted)] leading-relaxed">
      {{ data.message }}
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="space-x-2 pt-4">
      <button mat-button (click)="onCancel()" class="cafe-btn-outline">
        {{ data.cancelText || 'Hủy' }}
      </button>
      <button 
        mat-flat-button 
        [class.cafe-btn-primary]="!data.isDestructive" 
        [class.bg-rose-600]="data.isDestructive" 
        [class.text-white]="data.isDestructive"
        (click)="onConfirm()"
      >
        {{ data.confirmText || 'Xác nhận' }}
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
