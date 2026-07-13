import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  template: `
    <span [class]="chipClasses() + ' inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border font-title'">
      <span [class]="indicatorClasses() + ' w-1.5 h-1.5 rounded-full mr-1.5'"></span>
      {{ label() }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusChipComponent {
  status = input.required<string>();
  type = input<'room' | 'booking'>('room');

  // Compute label based on status and type
  label = computed(() => {
    const s = this.status().toLowerCase();
    if (this.type() === 'room') {
      switch (s) {
        case 'available': return 'Còn trống';
        case 'active': return 'Hoạt động';
        case 'maintenance': return 'Bảo trì';
        default: return s;
      }
    } else {
      switch (s) {
        case 'pending': return 'Chờ xác nhận';
        case 'confirmed': return 'Đã xác nhận';
        case 'cancelled': return 'Đã hủy';
        default: return s;
      }
    }
  });

  // Compute CSS classes for parent container
  chipClasses = computed(() => {
    const s = this.status().toLowerCase();
    if (this.type() === 'room') {
      switch (s) {
        case 'available':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
        case 'active':
          return 'bg-[var(--color-secondary)] text-[var(--color-primary-dark)] border-[rgba(123,94,87,0.15)]';
        case 'maintenance':
          return 'bg-rose-50 text-rose-700 border-rose-200/50';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    } else {
      switch (s) {
        case 'pending':
          return 'bg-amber-50 text-amber-700 border-amber-200/50';
        case 'confirmed':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
        case 'cancelled':
          return 'bg-rose-50 text-rose-700 border-rose-200/50';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
  });

  // Compute CSS classes for dot indicator
  indicatorClasses = computed(() => {
    const s = this.status().toLowerCase();
    if (this.type() === 'room') {
      switch (s) {
        case 'available': return 'bg-emerald-500';
        case 'active': return 'bg-[var(--color-primary)]';
        case 'maintenance': return 'bg-rose-500';
        default: return 'bg-gray-500';
      }
    } else {
      switch (s) {
        case 'pending': return 'bg-amber-500';
        case 'confirmed': return 'bg-emerald-500';
        case 'cancelled': return 'bg-rose-500';
        default: return 'bg-gray-500';
      }
    }
  });
}
