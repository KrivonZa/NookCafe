-- =========================================
-- V2: Seed the 5 fixed meeting rooms
-- =========================================

INSERT INTO workspace (name, description, capacity_min, capacity_max, price_per_hour, status, image_url)
VALUES ('Espresso Cozy',
        'Warm Scandinavian café. Perfect for interviews, mentoring sessions, and small meetings.',
        4, 6, 150000, 'AVAILABLE',
        'https://firebasestorage.googleapis.com/v0/b/nook-cafe-e08be.firebasestorage.app/o/Espresso_Cozy.png?alt=media&token=71fdf521-2a12-4fa6-83da-6dc8d74375a0'),

       ('Latte Corner',
        'Greenhouse-inspired café filled with natural light and plants. Ideal for brainstorming sessions.',
        6, 8, 200000, 'AVAILABLE',
        'https://firebasestorage.googleapis.com/v0/b/nook-cafe-e08be.firebasestorage.app/o/Latte_Corner.png?alt=media&token=c2ff1d1c-d620-43cc-9d5a-7e1de167dfb8'),

       ('Mocha Loft',
        'Industrial café with creative studio vibes. Suitable for startup teams.',
        8, 10, 250000, 'AVAILABLE', 'https://firebasestorage.googleapis.com/v0/b/nook-cafe-e08be.firebasestorage.app/o/Mocha_Loft.png?alt=media&token=07a45c03-62c7-4b75-bd23-6965b38e9b1b'),

       ('Cappuccino Hub',
        'Premium contemporary hospitality. Suitable for client meetings.',
        10, 12, 350000, 'AVAILABLE', 'https://firebasestorage.googleapis.com/v0/b/nook-cafe-e08be.firebasestorage.app/o/Cappuccino_Hub.png?alt=media&token=347eaf43-4d78-4fb9-b838-fb35d8f8d2b8'),

       ('Signature Reserve',
        'Luxury flagship meeting room. Suitable for workshops and seminars.',
        12, 15, 450000, 'AVAILABLE', 'https://firebasestorage.googleapis.com/v0/b/nook-cafe-e08be.firebasestorage.app/o/Signature_Reserve.png?alt=media&token=f2f654eb-107e-41b1-a61d-9cac1e093f82');

-- =========================================
-- V2: Seed a default staff account (for local/dev testing only)
-- Plaintext for local dev reference: "ChangeMe123!"
-- =========================================

INSERT INTO staff (full_name, email, password_hash)
VALUES ('Admin Staff', 'admin@nookcafe.dev', '$2a$10$oC1iKz6r8Lf77Lc/m324Su4pk93fFQ7Kx15xjxAzDso2SxqXyU9Z.');
