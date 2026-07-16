-- =========================================
-- V1: Initial schema
-- =========================================

CREATE TABLE workspace (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    capacity_min    SMALLINT NOT NULL,
    capacity_max    SMALLINT NOT NULL,
    price_per_hour  NUMERIC(12,0) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE'
                        CHECK (status IN ('AVAILABLE','MAINTENANCE','INACTIVE')),
    image_url       VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT chk_capacity CHECK (capacity_max >= capacity_min)
);

CREATE TABLE staff (
    id              BIGSERIAL PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE booking (
    id                   BIGSERIAL PRIMARY KEY,
    workspace_id         BIGINT NOT NULL REFERENCES workspace(id),
    start_time           TIMESTAMP NOT NULL,
    end_time             TIMESTAMP NOT NULL,
    expires_at           TIMESTAMP,
    number_of_guests     SMALLINT NOT NULL,
    full_name            VARCHAR(100) NOT NULL,
    phone_number         VARCHAR(15) NOT NULL,
    email                VARCHAR(150),
    notes                VARCHAR(300),
    status               VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','EXPIRED')),
    total_price          NUMERIC(12,0) NOT NULL,
    handled_by_staff_id  BIGINT REFERENCES staff(id),
    created_at           TIMESTAMP NOT NULL DEFAULT now(),
    updated_at           TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

-- Indexes to support the overlap check and the PENDING-expiration scheduled job
CREATE INDEX idx_booking_workspace_status_time
    ON booking (workspace_id, status, start_time, end_time);

CREATE INDEX idx_booking_expires_at
    ON booking (status, expires_at)
    WHERE status = 'PENDING';

CREATE INDEX idx_booking_phone
    ON booking (phone_number);

-- Keep updated_at fresh automatically on every UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_workspace_updated_at
    BEFORE UPDATE ON workspace
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_booking_updated_at
    BEFORE UPDATE ON booking
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
