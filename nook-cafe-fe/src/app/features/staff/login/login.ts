import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="min-h-screen bg-[var(--color-secondary)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <mat-card class="max-w-md w-full p-8 bg-white border border-[rgba(123,94,87,0.06)] shadow-sm">
        
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex p-3 bg-[var(--color-primary)] text-white rounded-full mb-3">
            <mat-icon class="!h-8 !w-8 !text-[32px] flex items-center justify-center">coffee</mat-icon>
          </div>
          <h2 class="text-2xl font-bold font-title text-[var(--color-primary-dark)]">Nook Staff Portal</h2>
          <p class="text-sm text-[var(--color-text-muted)] mt-1">Đăng nhập tài khoản quản lý phòng họp</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Username input -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Tên đăng nhập</mat-label>
            <input matInput formControlName="username" placeholder="admin" />
            <mat-icon matSuffix class="text-[var(--color-text-muted)]">person</mat-icon>
            @if (loginForm.get('username')?.hasError('required')) {
              <mat-error>Tên đăng nhập là bắt buộc</mat-error>
            }
          </mat-form-field>

          <!-- Password input -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Mật khẩu</mat-label>
            <input 
              matInput 
              [type]="hidePassword() ? 'password' : 'text'" 
              formControlName="password" 
              placeholder="••••••••" 
            />
            <button 
              mat-icon-button 
              matSuffix 
              type="button"
              (click)="hidePassword.set(!hidePassword())"
              [attr.aria-label]="'Ẩn mật khẩu'"
              [attr.aria-pressed]="hidePassword()"
              class="text-[var(--color-text-muted)]"
            >
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (loginForm.get('password')?.hasError('required')) {
              <mat-error>Mật khẩu là bắt buộc</mat-error>
            }
          </mat-form-field>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-[var(--radius-sm)] flex items-center">
              <mat-icon class="mr-1.5 text-rose-500 !h-4 !w-4 !text-[16px]">error</mat-icon>
              {{ errorMessage() }}
            </div>
          }

          <!-- Submit Button -->
          <button 
            mat-flat-button 
            type="submit" 
            class="cafe-btn-primary w-full py-3 text-sm font-semibold"
            [disabled]="loginForm.invalid || isLoading()"
          >
            @if (isLoading()) {
              <span>Đang đăng nhập...</span>
            } @else {
              <span>Đăng nhập</span>
            }
          </button>
        </form>

        <div class="text-center mt-6">
          <a 
            routerLink="/" 
            class="inline-flex items-center text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            <mat-icon class="mr-1 !h-3.5 !w-3.5 !text-[14px]">arrow_back</mat-icon>
            Quay về trang khách hàng
          </a>
        </div>

      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginForm!: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;

    // Simulate login delay
    setTimeout(() => {
      const success = this.authService.login(username, password);
      if (success) {
        this.router.navigate(['/staff']);
      } else {
        this.isLoading.set(false);
        this.errorMessage.set('Tài khoản hoặc mật khẩu không chính xác (Thử: admin / admin123)');
      }
    }, 1000);
  }
}
