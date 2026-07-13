import { Injectable, signal, computed } from '@angular/core';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly _rooms = signal<Room[]>([
    {
      id: 1,
      name: 'Espresso Cozy',
      capacity: '4 – 6 người',
      capacityMin: 4,
      capacityMax: 6,
      pricePerHour: 150000,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=600&auto=format&fit=crop',
      description: 'Phòng Espresso Cozy mang lại một không gian ấm cúng, thiết kế tối giản với ánh sáng vàng ấm áp. Thích hợp cho các buổi họp nhóm nhỏ, thảo luận ý tưởng mới hay phỏng vấn ứng viên. Phòng được trang bị đầy đủ bảng viết, smart TV và cách âm tốt.',
      amenities: ['Wifi tốc độ cao', 'Smart TV', 'Điều hòa', 'Cà phê miễn phí', 'Bảng viết kính'],
      gallery: [
        'https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    {
      id: 2,
      name: 'Cappuccino Modern',
      capacity: '8 – 10 người',
      capacityMin: 8,
      capacityMax: 10,
      pricePerHour: 250000,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      description: 'Thiết kế hiện đại, tinh tế với cửa kính rộng nhìn ra vườn xanh mát của café. Phòng Cappuccino Modern mang đến nguồn cảm hứng làm việc dồi dào, lý tưởng cho các cuộc gặp gỡ đối tác quan trọng hoặc các buổi họp chiến lược.',
      amenities: ['Wifi tốc độ cao', 'Máy chiếu', 'Điều hòa', 'Cà phê miễn phí', 'Ổ cắm điện đa năng', 'Hỗ trợ in ấn'],
      gallery: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    {
      id: 3,
      name: 'Latte Premium',
      capacity: '12 – 15 người',
      capacityMin: 12,
      capacityMax: 15,
      pricePerHour: 350000,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
      description: 'Phòng họp lớn nhất tại Nook Café với sức chứa lên tới 15 người. Không gian rộng rãi, trang bị đầy đủ các thiết bị công nghệ hiện đại nhất bao gồm cả hệ thống âm thanh, loa mic hội nghị trực tuyến và bảng tương tác thông minh.',
      amenities: ['Wifi tốc độ cao', 'Máy chiếu', 'Smart TV', 'Điều hòa', 'Cà phê miễn phí', 'Hệ thống loa hội nghị', 'Bảng di động'],
      gallery: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    {
      id: 4,
      name: 'Mocha Vintage',
      capacity: '6 – 8 người',
      capacityMin: 6,
      capacityMax: 8,
      pricePerHour: 200000,
      status: 'maintenance',
      image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop',
      description: 'Phòng Mocha mang phong cách cổ điển, mộc mạc với các nội thất gỗ tự nhiên và gạch nung. Nơi đây đem lại cảm giác quen thuộc, thư thái, rất thích hợp để làm việc tập trung cao độ hoặc workshop sáng tạo nhỏ.',
      amenities: ['Wifi tốc độ cao', 'Điều hòa', 'Cà phê miễn phí', 'Bảng gỗ'],
      gallery: [
        'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1200&auto=format&fit=crop'
      ]
    }
  ]);

  readonly rooms = computed(() => this._rooms());

  getRoomById(id: number): Room | undefined {
    return this._rooms().find(room => room.id === id);
  }

  updateRoom(id: number, updatedRoom: Partial<Room>): void {
    this._rooms.update(prev => 
      prev.map(room => room.id === id ? { ...room, ...updatedRoom } : room)
    );
  }
}
