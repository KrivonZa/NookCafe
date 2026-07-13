import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center bg-[var(--color-cream)] rounded-[var(--radius-lg)] border-2 border-dashed border-[rgba(123,94,87,0.15)] my-4">
      <mat-icon class="text-[var(--color-primary-light)] !h-12 !w-12 !text-[48px] mb-4">{{ icon() }}</mat-icon>
      <h3 class="text-lg font-semibold text-[var(--color-primary-dark)] mb-2">{{ title() }}</h3>
      <p class="text-sm text-[var(--color-text-muted)] max-w-md">{{ message() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  icon = input<string>('inbox');
  title = input<string>('Không tìm thấy dữ liệu');
  message = input<string>('Vui lòng thử lại với từ khóa hoặc bộ lọc khác.');
}
