import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Room } from '../models/room.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/workspaces';

  private readonly _rooms = signal<Room[]>([]);
  readonly rooms = computed(() => this._rooms());

  constructor() {
    this.loadInitialRooms();
  }

  loadInitialRooms(): void {
    this.http.get<any[]>(`${this.apiUrl}?all=true`)
      .subscribe({
        next: (workspaces) => {
          const rooms = workspaces.map(w => this.mapWorkspaceToRoom(w));
          this._rooms.set(rooms);
        },
        error: (err) => {
          console.error('Failed to load workspaces:', err);
        }
      });
  }

  getRoomById(id: number): Room | undefined {
    return this._rooms().find(room => room.id === id);
  }

  getWorkspaceDetails(id: number): Observable<Room> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(w => this.mapWorkspaceToRoom(w))
    );
  }

  searchWorkspaces(search?: string, capacity?: string, all = true): Observable<Room[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (capacity && capacity !== 'all') {
      if (capacity === 'small') {
        params = params.set('capacityMax', '6');
      } else if (capacity === 'medium') {
        params = params.set('capacityMin', '6');
        params = params.set('capacityMax', '10');
      } else if (capacity === 'large') {
        params = params.set('capacityMin', '10');
      }
    }
    params = params.set('all', all.toString());

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map(workspaces => workspaces.map(w => this.mapWorkspaceToRoom(w)))
    );
  }

  updateRoom(id: number, updatedRoom: Room): Observable<Room> {
    const backendDto = {
      id: updatedRoom.id,
      name: updatedRoom.name,
      description: updatedRoom.description,
      capacityMin: updatedRoom.capacityMin,
      capacityMax: updatedRoom.capacityMax,
      pricePerHour: updatedRoom.pricePerHour,
      status: this.mapStatusToBackend(updatedRoom.status),
      imageUrl: updatedRoom.image
    };

    return this.http.put<any>(`${this.apiUrl}/${id}`, backendDto).pipe(
      map(w => this.mapWorkspaceToRoom(w)),
      tap(newRoom => {
        this._rooms.update(prev => 
          prev.map(room => room.id === id ? newRoom : room)
        );
      })
    );
  }

  private mapWorkspaceToRoom(w: any): Room {
    return {
      id: w.id,
      name: w.name,
      capacity: `${w.capacityMin} – ${w.capacityMax} người`,
      capacityMin: w.capacityMin,
      capacityMax: w.capacityMax,
      pricePerHour: w.pricePerHour,
      status: this.mapStatusToFrontend(w.status),
      image: w.imageUrl || 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=600&auto=format&fit=crop',
      description: w.description || '',
      amenities: this.getDefaultAmenities(w.capacityMin, w.capacityMax),
      gallery: [
        w.imageUrl || 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'
      ]
    };
  }

  private mapStatusToFrontend(status: string): 'available' | 'active' | 'maintenance' {
    const s = status.toUpperCase();
    if (s === 'AVAILABLE') return 'available';
    if (s === 'MAINTENANCE') return 'maintenance';
    return 'active'; // INACTIVE maps to active
  }

  private mapStatusToBackend(status: 'available' | 'active' | 'maintenance'): string {
    if (status === 'available') return 'AVAILABLE';
    if (status === 'maintenance') return 'MAINTENANCE';
    return 'INACTIVE'; // active maps to INACTIVE
  }

  private getDefaultAmenities(capacityMin: number, capacityMax: number): string[] {
    const base = ['Wifi tốc độ cao', 'Điều hòa', 'Cà phê miễn phí'];
    if (capacityMax <= 6) {
      return [...base, 'Smart TV', 'Bảng viết kính'];
    } else if (capacityMax <= 10) {
      return [...base, 'Máy chiếu', 'Ổ cắm điện đa năng', 'Hỗ trợ in ấn'];
    } else {
      return [...base, 'Máy chiếu', 'Smart TV', 'Hệ thống loa hội nghị', 'Bảng di động'];
    }
  }
}
