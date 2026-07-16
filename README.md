# ☕ Nook Café

**Nook Café** is a web application for booking cozy, private meeting rooms online at a premium coffee shop. Instead of a traditional corporate coworking portal, Nook Café focuses on providing a warm, boutique café atmosphere styled with Scandinavian and Japandi aesthetics, making it the perfect space for discussions, interviews, workshops, or small team meetings.

---

## 🎯 Key Features

The project consists of three main modules:
1. **Public Landing Page**: Introduces the café's theme, available amenities, meeting room layouts, pricing, and location.
2. **Self-Service Online Booking (Guests)**: Allows customers to browse room availability in real-time, select date/time slots, and submit booking requests without needing to register or log in.
3. **Staff Management Portal (Staff)**: A secure workspace dashboard where café staff can monitor schedules, view booking requests, and confirm (CONFIRMED) or cancel (CANCELLED) reservations.

---

## 🚪 Meeting Rooms

The system manages 5 fixed meeting room configurations with the following specifications:

| Room Name | Capacity | Price (VND/hour) | Design Style & Vibe |
|---|---|---|---|
| **Espresso Cozy** | 4–6 people | 150,000 | Warm Scandinavian café style. Ideal for interviews, mentoring, or small discussions. |
| **Latte Corner** | 6–8 people | 200,000 | Greenhouse-inspired space filled with natural light and indoor plants. |
| **Mocha Loft** | 8–10 people | 250,000 | Industrial style with creative studio vibes. Great for startup teams. |
| **Cappuccino Hub** | 10–12 people | 350,000 | Premium contemporary hospitality style. Perfect for client meetings. |
| **Signature Reserve** | 12–15 people | 450,000 | Luxury flagship workspace, suitable for workshops and seminars. |

*Each meeting room is fully equipped with a Smart TV, a conference camera, a glass whiteboard, built-in power outlets & USB-C ports, air conditioning, bottled water, a coffee tray, and decorative indoor plants.*

---

## 💼 Core Business Rules

The application enforces strict operational validations to ensure booking consistency and prevent scheduling conflicts:

### 🕒 Operating Hours & Time Selection
* **Operating Hours**:
  * **Monday – Friday**: 07:00 – 22:00
  * **Saturday – Sunday**: 08:00 – 23:00
* A booking's duration must fall entirely within the operating hours of that day.
* Guests select start and end times in **15-minute increments** (e.g., 14:15, 14:30, 14:45...).

### ⏳ Booking Durations & Turnover Buffer
* **Minimum Duration**: 1 hour (60 minutes).
* **Maximum Duration**: 4 hours per booking.
* **Turnover Buffer**: A **15-minute buffer** is automatically reserved both **before** and **after** every booking for room cleaning and setup.
  * The buffer is **not shown** to the guest and is **not charged** (billing is based strictly on the booking's actual duration).
  * The buffer **may extend outside operating hours** (e.g., a Sunday booking ending at 23:00 reserves a post-buffer running 23:00–23:15).
  * A new booking can legally start exactly when a prior booking's buffer ends.

### 📅 Same-Day Bookings (Lead Time)
* For bookings scheduled for **today**, the `startTime` must be at least **30 minutes** from the current time.
* This 30-minute lead time is rounded **up** to the next valid 15-minute increment (e.g., if the current time is 15:07 → the earliest bookable time is 15:45).

### 👥 Capacity & Availability Constraints
* The number of guests requested must not exceed the room's maximum capacity (`numberOfGuests <= capacity_max`).
* Rooms under maintenance or marked as inactive (`MAINTENANCE`, `INACTIVE`) are blocked and cannot be booked under any circumstances.

### 🛡 Conflict Prevention (Overlap Checking)
A new booking request conflicts with an existing reservation (status `PENDING` or `CONFIRMED`) if their booking windows overlap after accounting for the buffers:
$$\text{newStart} < \text{existingEnd} + 15\text{ min} \quad \text{AND} \quad \text{newEnd} > \text{existingStart} - 15\text{ min}$$
This validation runs within a single, database-locked transaction to prevent double-booking race conditions.

### ⏳ Dynamic PENDING Expiration
To release unreviewed requests that block time slots, PENDING bookings expire automatically based on the following deadline computed at creation:
$$\text{expiresAt} = \min(\text{createdAt} + 4\text{ hours}, \text{startTime} - 15\text{ minutes})$$
A scheduled background service sweeps the database periodically to transition overdue bookings to `EXPIRED`.

### 💵 Pricing
The total price is calculated strictly as:
$$\text{Total Price} = \text{Room Rate per Hour} \times \text{Duration (hours)}$$
*(Buffer times are never included in the pricing calculation).*
