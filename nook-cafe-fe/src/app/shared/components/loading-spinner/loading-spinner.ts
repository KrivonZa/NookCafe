import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center p-6 space-y-3">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary)]"></div>
      @if (message()) {
        <p class="text-sm font-medium text-[var(--color-text-muted)] font-body">{{ message() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  message = input<string>('Đang tải dữ liệu...');
}
