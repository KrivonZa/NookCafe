-- =========================================
-- V2: Seed the 5 fixed meeting rooms
-- =========================================

INSERT INTO workspace (name, description, capacity_min, capacity_max, price_per_hour, status, image_url) VALUES
('Espresso Cozy',
 'Warm Scandinavian café. Perfect for interviews, mentoring sessions, and small meetings.',
 4, 6, 150000, 'AVAILABLE', NULL),

('Latte Corner',
 'Greenhouse-inspired café filled with natural light and plants. Ideal for brainstorming sessions.',
 6, 8, 200000, 'AVAILABLE', NULL),

('Mocha Loft',
 'Industrial café with creative studio vibes. Suitable for startup teams.',
 8, 10, 250000, 'AVAILABLE', NULL),

('Cappuccino Hub',
 'Premium contemporary hospitality. Suitable for client meetings.',
 10, 12, 350000, 'AVAILABLE', NULL),

('Signature Reserve',
 'Luxury flagship meeting room. Suitable for workshops and seminars.',
 12, 15, 450000, 'AVAILABLE', NULL);

-- =========================================
-- V2: Seed a default staff account (for local/dev testing only)
-- Plaintext for local dev reference: "ChangeMe123!"
-- =========================================

INSERT INTO staff (full_name, email, password_hash) VALUES
('Admin Staff', 'admin@nookcafe.dev', '$2a$10$oC1iKz6r8Lf77Lc/m324Su4pk93fFQ7Kx15xjxAzDso2SxqXyU9Z.');
