import { Injectable, signal, computed } from '@angular/core';
import { Booking, TimeSlot } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly defaultSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00',
    '19:00 - 21:00'
  ];

  private readonly _bookings = signal<Booking[]>([
    {
      id: 'BK-1001',
      customerName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@gmail.com',
      notes: 'Họp hội đồng quản trị định kỳ, cần chuẩn bị sẵn nước ấm.',
      roomId: 2,
      roomName: 'Cappuccino Modern',
      date: this.getRelativeDateStr(0), // Today
      timeSlot: '10:00 - 12:00',
      status: 'confirmed',
      createdAt: '2026-07-12T08:00:00.000Z'
    },
    {
      id: 'BK-1002',
      customerName: 'Trần Thị B',
      phone: '0912345678',
      email: 'tranthib@gmail.com',
      notes: 'Phỏng vấn ứng viên tuyển dụng.',
      roomId: 1,
      roomName: 'Espresso Cozy',
      date: this.getRelativeDateStr(0), // Today
      timeSlot: '13:00 - 15:00',
      status: 'pending',
      createdAt: '2026-07-12T08:15:00.000Z'
    },
    {
      id: 'BK-1003',
      customerName: 'Phạm Minh C',
      phone: '0923456789',
      email: 'phamminhc@gmail.com',
      notes: 'Học nhóm ôn thi học kỳ.',
      roomId: 3,
      roomName: 'Latte Premium',
      date: this.getRelativeDateStr(1), // Tomorrow
      timeSlot: '15:00 - 17:00',
      status: 'confirmed',
      createdAt: '2026-07-11T14:30:00.000Z'
    },
    {
      id: 'BK-1004',
      customerName: 'Lê Hoàng D',
      phone: '0934567890',
      email: 'lehoangd@gmail.com',
      notes: 'Ký kết hợp đồng chuyển nhượng.',
      roomId: 2,
      roomName: 'Cappuccino Modern',
      date: this.getRelativeDateStr(-1), // Yesterday
      timeSlot: '15:00 - 17:00',
      status: 'cancelled',
      createdAt: '2026-07-10T09:00:00.000Z'
    },
    {
      id: 'BK-1005',
      customerName: 'Vũ Thị E',
      phone: '0945678901',
      email: 'vuthie@gmail.com',
      notes: 'Họp kick-off dự án phần mềm mới.',
      roomId: 3,
      roomName: 'Latte Premium',
      date: this.getRelativeDateStr(0), // Today
      timeSlot: '17:00 - 19:00',
      status: 'pending',
      createdAt: '2026-07-12T08:20:00.000Z'
    }
  ]);

  readonly bookings = computed(() => this._bookings());

  private getRelativeDateStr(offsetDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  getTimeSlotsForRoomAndDate(roomId: number, dateStr: string): TimeSlot[] {
    const bookedSlotsForDate = this._bookings()
      .filter(b => b.roomId === roomId && b.date === dateStr && b.status !== 'cancelled')
      .map(b => b.timeSlot);

    return this.defaultSlots.map(slot => ({
      slot,
      available: !bookedSlotsForDate.includes(slot)
    }));
  }

  createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this._bookings.update(prev => [newBooking, ...prev]);
    return newBooking;
  }

  updateBookingStatus(id: string, status: 'confirmed' | 'cancelled'): void {
    this._bookings.update(prev =>
      prev.map(b => b.id === id ? { ...b, status } : b)
    );
  }
}
