import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-staff-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    DatePipe
  ],
  template: `
    <div class="flex h-screen overflow-hidden bg-[var(--color-secondary)]">
      
      <!-- Sidebar Panel -->
      <aside 
        [class.translate-x-0]="isSidebarOpen()" 
        [class.-translate-x-full]="!isSidebarOpen()"
        class="fixed md:static inset-y-0 left-0 z-40 w-64 bg-[var(--color-primary-dark)] text-[var(--color-secondary)] flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[rgba(123,94,87,0.15)] shadow-lg"
      >
        <div>
          <!-- Sidebar Brand -->
          <div class="h-20 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.06)]">
            <a routerLink="/" class="flex items-center space-x-2">
              <span class="p-1.5 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center">
                <mat-icon class="!h-4 !w-4 !text-[16px]">coffee</mat-icon>
              </span>
              <span class="font-title text-lg font-bold tracking-tight text-white">
                Nook Staff
              </span>
            </a>
            
            <button 
              (click)="toggleSidebar()" 
              class="md:hidden p-1 text-[var(--color-secondary)] hover:bg-[rgba(255,255,255,0.08)] rounded-full"
              aria-label="Close sidebar"
            >
              <mat-icon>chevron_left</mat-icon>
            </button>
          </div>

          <!-- Sidebar Nav links -->
          <nav class="p-4 space-y-2 mt-4 font-title text-sm">
            <a 
              routerLink="/staff" 
              routerLinkActive="bg-[var(--color-accent)] text-white font-semibold shadow-md"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="onNavLinkClick()"
              class="flex items-center space-x-3 px-4 py-3 rounded-[var(--radius-md)] text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
            >
              <mat-icon class="!h-5 !w-5 !text-[20px]">dashboard</mat-icon>
              <span>Dashboard</span>
            </a>

            <a 
              routerLink="/staff/rooms" 
              routerLinkActive="bg-[var(--color-accent)] text-white font-semibold shadow-md"
              (click)="onNavLinkClick()"
              class="flex items-center space-x-3 px-4 py-3 rounded-[var(--radius-md)] text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
            >
              <mat-icon class="!h-5 !w-5 !text-[20px]">meeting_room</mat-icon>
              <span>Phòng họp</span>
            </a>

            <a 
              routerLink="/staff/bookings" 
              routerLinkActive="bg-[var(--color-accent)] text-white font-semibold shadow-md"
              (click)="onNavLinkClick()"
              class="flex items-center space-x-3 px-4 py-3 rounded-[var(--radius-md)] text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
            >
              <mat-icon class="!h-5 !w-5 !text-[20px]">event_note</mat-icon>
              <span>Lịch đặt</span>
            </a>
          </nav>
        </div>

        <!-- Sidebar footer / Logout -->
        <div class="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <button 
            (click)="logout()" 
            class="flex items-center space-x-3 w-full px-4 py-3 rounded-[var(--radius-md)] text-rose-300 hover:text-white hover:bg-rose-900/30 transition-all font-title text-sm text-left"
          >
            <mat-icon class="!h-5 !w-5 !text-[20px]">logout</mat-icon>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <!-- Overlay for Mobile Sidenav -->
      @if (isSidebarOpen() && isMobileView()) {
        <div 
          (click)="toggleSidebar()" 
          class="fixed inset-0 z-30 bg-black/45 md:hidden"
        ></div>
      }

      <!-- Main Layout Body -->
      <div class="flex-grow flex flex-col min-w-0">
        
        <!-- Topbar -->
        <header class="h-20 bg-white border-b border-[rgba(123,94,87,0.1)] flex items-center justify-between px-6 flex-shrink-0">
          <div class="flex items-center space-x-4">
            <button 
              (click)="toggleSidebar()" 
              class="p-2 text-[var(--color-primary-dark)] hover:bg-[var(--color-secondary)] rounded-full transition-colors"
              aria-label="Toggle navigation menu"
            >
              <mat-icon>menu</mat-icon>
            </button>
            <h1 class="text-xl font-bold font-title text-[var(--color-primary-dark)] hidden sm:block">Trang Quản Trị</h1>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Logo display -->
            <div class="flex items-center space-x-2 text-right">
              <span class="text-xs text-[var(--color-text-muted)] font-medium font-body block">
                {{ today | date:'EEEE, dd/MM/yyyy' }}
              </span>
              <span class="text-sm font-semibold font-title text-[var(--color-primary)]">
                Admin
              </span>
            </div>
            <span class="w-10 h-10 rounded-full bg-[var(--color-primary-light)] text-white flex items-center justify-center font-bold font-title">
              A
            </span>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-grow p-6 overflow-y-auto bg-[var(--color-secondary)]">
          <div class="max-w-6xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isSidebarOpen = signal(true);
  isMobileView = signal(false);
  today = new Date();

  constructor() {
    this.checkScreenSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 768;
      this.isMobileView.set(mobile);
      if (mobile) {
        this.isSidebarOpen.set(false);
      } else {
        this.isSidebarOpen.set(true);
      }
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }

  onNavLinkClick(): void {
    if (this.isMobileView()) {
      this.isSidebarOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/staff/login']);
  }
}
