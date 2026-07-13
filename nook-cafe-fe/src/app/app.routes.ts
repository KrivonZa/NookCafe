import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Experience layout wrapper
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/landing').then(m => m.LandingComponent),
        title: 'Nook Café - Trang chủ đặt phòng họp'
      },
      {
        path: 'rooms',
        loadComponent: () => import('./features/rooms/rooms-list/rooms-list').then(m => m.RoomsListComponent),
        title: 'Nook Café - Danh sách phòng họp'
      },
      {
        path: 'rooms/:id',
        loadComponent: () => import('./features/rooms/room-detail/room-detail').then(m => m.RoomDetailComponent),
        title: 'Nook Café - Chi tiết phòng họp'
      },
      {
        path: 'booking-success',
        loadComponent: () => import('./features/booking/booking-success/booking-success').then(m => m.BookingSuccessComponent),
        title: 'Nook Café - Đặt phòng thành công'
      }
    ]
  },
  
  // Staff Login
  {
    path: 'staff/login',
    loadComponent: () => import('./features/staff/login/login').then(m => m.LoginComponent),
    title: 'Nook Staff Portal - Đăng nhập'
  },

  // Staff Experience layout wrapper (Guarded)
  {
    path: 'staff',
    loadComponent: () => import('./layouts/staff-layout/staff-layout').then(m => m.StaffLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/staff/dashboard/dashboard').then(m => m.DashboardComponent),
        title: 'Nook Staff Portal - Bảng quản trị'
      },
      {
        path: 'rooms',
        loadComponent: () => import('./features/staff/rooms/rooms').then(m => m.StaffRoomsComponent),
        title: 'Nook Staff Portal - Quản lý phòng họp'
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/staff/bookings/bookings').then(m => m.StaffBookingsComponent),
        title: 'Nook Staff Portal - Quản lý đơn đặt lịch'
      }
    ]
  },

  // Fallback Catch-all Route
  {
    path: '**',
    redirectTo: ''
  }
];
