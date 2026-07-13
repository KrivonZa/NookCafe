import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Room } from '../../../models/room.model';
import { StatusChipComponent } from '../status-chip/status-chip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [
    RouterLink,
    StatusChipComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CurrencyPipe
  ],
  template: `
    <mat-card class="flex flex-col h-full">
      <div class="relative overflow-hidden aspect-[4/3] w-full bg-[var(--color-secondary)]">
        <img 
          [src]="room().image" 
          [alt]="room().name" 
          class="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div class="absolute top-3 right-3 z-10">
          <app-status-chip [status]="room().status" type="room"></app-status-chip>
        </div>
      </div>
      
      <mat-card-content class="flex-grow p-5 flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-semibold mb-2 text-[var(--color-primary-dark)] leading-tight hover:text-[var(--color-primary)]">
            <a [routerLink]="['/rooms', room().id]">{{ room().name }}</a>
          </h3>
          <div class="flex items-center space-x-4 text-sm text-[var(--color-text-muted)] mb-4">
            <span class="flex items-center">
              <mat-icon class="mr-1 text-xs !w-4 !h-4 !text-[16px] text-[var(--color-accent)]">group</mat-icon>
              {{ room().capacity }}
            </span>
            <span class="flex items-center">
              <mat-icon class="mr-1 text-xs !w-4 !h-4 !text-[16px] text-[var(--color-accent)]">payments</mat-icon>
              {{ room().pricePerHour | currency:'VND':'symbol-narrow':'1.0-0' }} / giờ
            </span>
          </div>
          <p class="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4 leading-relaxed">
            {{ room().description }}
          </p>
        </div>
        
        <div class="mt-auto">
          <a 
            mat-flat-button 
            [routerLink]="['/rooms', room().id]" 
            class="cafe-btn-primary w-full text-center py-2"
          >
            <span>Xem chi tiết</span>
            <mat-icon class="ml-1 !w-4 !h-4 !text-[16px] align-middle">chevron_right</mat-icon>
          </a>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomCardComponent {
  room = input.required<Room>();
}
