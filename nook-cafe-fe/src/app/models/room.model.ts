export interface Room {
  id: number;
  name: string;
  capacity: string; // e.g. "4-6 người", "8-10 người", "12-15 người"
  capacityMin: number;
  capacityMax: number;
  pricePerHour: number; // e.g. 150000
  status: 'available' | 'active' | 'maintenance'; // Vietnamese: "Còn trống" | "Hoạt động" | "Bảo trì"
  image: string;
  description: string;
  amenities: string[];
  gallery: string[];
}

export interface TimeSlot {
  slot: string; // e.g. "08:00 - 10:00", "10:00 - 12:00", etc.
  available: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  notes?: string;
  roomId: number;
  roomName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "08:00 - 10:00"
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Amenity {
  name: string;
  icon: string;
}
