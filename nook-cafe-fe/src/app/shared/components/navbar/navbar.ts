import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  template: `
    <header class="bg-[var(--color-cream)] border-b border-[rgba(123,94,87,0.1)] sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Logo -->
        <a routerLink="/" class="flex items-center space-x-2">
          <img src="/homepage/dark-horizontal-logo.png" alt="Nook Café Logo" class="h-18 md:h-20 w-auto"/>
        </a>

        <!-- Desktop Menu -->
        <nav class="hidden md:flex items-center space-x-8 font-title text-sm font-medium">
          <a 
            routerLink="/" 
            routerLinkActive="text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)] pb-1"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            Trang chủ
          </a>
          <a 
            routerLink="/rooms" 
            routerLinkActive="text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)] pb-1"
            class="text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            Phòng họp
          </a>
        </nav>

        <!-- CTA & Mobile Toggle -->
        <div class="flex items-center space-x-4">
          <a 
            mat-flat-button 
            routerLink="/rooms" 
            class="cafe-btn-primary hidden sm:inline-flex"
          >
            Đặt phòng ngay
          </a>
          
          <button 
            (click)="toggleMenu()" 
            class="md:hidden p-2 text-[var(--color-primary-dark)] hover:bg-[var(--color-secondary)] rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            <mat-icon>{{ isOpen() ? 'close' : 'menu' }}</mat-icon>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (isOpen()) {
        <div class="md:hidden bg-[var(--color-cream)] border-t border-[rgba(123,94,87,0.1)] px-4 py-4 space-y-3 shadow-inner">
          <a 
            routerLink="/" 
            routerLinkActive="bg-[var(--color-secondary)] text-[var(--color-primary)]"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMenu()"
            class="block px-4 py-2.5 rounded-[var(--radius-md)] text-base font-medium text-[var(--color-text-dark)] hover:bg-[var(--color-secondary)]"
          >
            Trang chủ
          </a>
          <a 
            routerLink="/rooms" 
            routerLinkActive="bg-[var(--color-secondary)] text-[var(--color-primary)]"
            (click)="closeMenu()"
            class="block px-4 py-2.5 rounded-[var(--radius-md)] text-base font-medium text-[var(--color-text-dark)] hover:bg-[var(--color-secondary)]"
          >
            Phòng họp
          </a>
          <a 
            mat-flat-button 
            routerLink="/rooms" 
            (click)="closeMenu()"
            class="cafe-btn-primary w-full text-center"
          >
            Đặt phòng ngay
          </a>
        </div>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  isOpen = signal(false);

  toggleMenu(): void {
    this.isOpen.update(val => !val);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }
}
