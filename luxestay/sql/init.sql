-- ============================================================
-- LUXESTAY HOTEL MANAGEMENT SYSTEM — DATABASE INIT SCRIPT
-- ============================================================

CREATE DATABASE IF NOT EXISTS luxestay_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE luxestay_db;

-- ============================================================
-- TABLE: roles
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    phone      VARCHAR(20),
    active     BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: user_roles (join)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: rooms
-- ============================================================
CREATE TABLE IF NOT EXISTS rooms (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number  VARCHAR(20) NOT NULL UNIQUE,
    room_type    ENUM('SIMPLE','DOUBLE','SUITE','PENTHOUSE','FAMILY') NOT NULL,
    floor        INT NOT NULL DEFAULT 1,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity     INT NOT NULL DEFAULT 1,
    description  TEXT,
    image_url    VARCHAR(500),
    status       ENUM('AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED') DEFAULT 'AVAILABLE',
    has_wifi     BOOLEAN DEFAULT TRUE,
    has_minibar  BOOLEAN DEFAULT FALSE,
    has_balcony  BOOLEAN DEFAULT FALSE,
    has_jacuzzi  BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: clients (guests)
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name   VARCHAR(100) NOT NULL,
    last_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(150) UNIQUE,
    phone        VARCHAR(20),
    address      VARCHAR(255),
    city         VARCHAR(100),
    country      VARCHAR(100) DEFAULT 'Morocco',
    id_card      VARCHAR(50),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: reservations
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_no VARCHAR(20) NOT NULL UNIQUE,
    client_id      BIGINT NOT NULL,
    room_id        BIGINT NOT NULL,
    check_in_date  DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults         INT NOT NULL DEFAULT 1,
    children       INT DEFAULT 0,
    total_price    DECIMAL(10,2) NOT NULL,
    status         ENUM('PENDING','CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED') DEFAULT 'PENDING',
    special_requests TEXT,
    payment_status ENUM('UNPAID','PARTIAL','PAID') DEFAULT 'UNPAID',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (room_id)   REFERENCES rooms(id)
);

-- ============================================================
-- TABLE: employees
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE,
    phone       VARCHAR(20),
    position    ENUM('MANAGER','RECEPTIONIST','HOUSEKEEPER','MAINTENANCE','CHEF','SECURITY') NOT NULL,
    department  VARCHAR(100),
    salary      DECIMAL(10,2),
    hire_date   DATE NOT NULL,
    active      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Roles
INSERT INTO roles (name) VALUES ('ROLE_ADMIN'), ('ROLE_RECEPTIONIST') ON DUPLICATE KEY UPDATE name = name;

-- Admin user (password: Admin@123)
INSERT INTO users (first_name, last_name, email, password, phone, active) VALUES
('Admin', 'LuxeStay', 'admin@luxestay.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKGUn4dUB.J3pCQ9UHBUEBtUYVLS', '+212600000001', TRUE),
('Marie', 'Dupont',   'receptionist@luxestay.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKGUn4dUB.J3pCQ9UHBUEBtUYVLS', '+212600000002', TRUE)
ON DUPLICATE KEY UPDATE email = email;

-- Assign roles (assuming ids 1,2)
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 1), (2, 2);

-- Rooms
INSERT INTO rooms (room_number, room_type, floor, price_per_night, capacity, description, status, has_wifi, has_minibar, has_balcony, has_jacuzzi) VALUES
('101', 'SIMPLE',    1, 800.00,  1, 'Chambre simple confortable avec vue sur jardin', 'AVAILABLE', TRUE, FALSE, FALSE, FALSE),
('102', 'SIMPLE',    1, 800.00,  1, 'Chambre simple élégante avec bureau de travail', 'AVAILABLE', TRUE, FALSE, FALSE, FALSE),
('201', 'DOUBLE',    2, 1200.00, 2, 'Chambre double avec vue panoramique sur la ville', 'AVAILABLE', TRUE, TRUE,  FALSE, FALSE),
('202', 'DOUBLE',    2, 1200.00, 2, 'Chambre double avec lit king size', 'OCCUPIED', TRUE, TRUE, TRUE, FALSE),
('301', 'SUITE',     3, 2500.00, 2, 'Suite luxueuse avec salon séparé et terrasse privée', 'AVAILABLE', TRUE, TRUE, TRUE, FALSE),
('302', 'SUITE',     3, 2800.00, 3, 'Suite familiale avec deux chambres communicantes', 'RESERVED', TRUE, TRUE, TRUE, FALSE),
('401', 'PENTHOUSE', 4, 6000.00, 4, 'Penthouse exclusif avec piscine privée et vue 360°', 'AVAILABLE', TRUE, TRUE, TRUE, TRUE),
('402', 'FAMILY',    4, 1800.00, 4, 'Suite familiale spacieuse avec zone enfants', 'AVAILABLE', TRUE, TRUE, FALSE, FALSE),
('103', 'SIMPLE',    1, 750.00,  1, 'Chambre simple économique, calme et fonctionnelle', 'MAINTENANCE', TRUE, FALSE, FALSE, FALSE),
('203', 'DOUBLE',    2, 1300.00, 2, 'Chambre double deluxe avec baignoire balnéo', 'AVAILABLE', TRUE, TRUE, TRUE, TRUE)
ON DUPLICATE KEY UPDATE room_number = room_number;

-- Clients
INSERT INTO clients (first_name, last_name, email, phone, city, country, id_card) VALUES
('Ahmed',    'Benali',   'ahmed.benali@email.com',   '+212661234567', 'Casablanca', 'Morocco', 'AB123456'),
('Sophie',   'Martin',   'sophie.martin@email.fr',   '+33612345678',  'Paris',      'France',  'FR789012'),
('James',    'Wilson',   'james.wilson@email.com',   '+14155552671',  'New York',   'USA',     'US345678'),
('Fatima',   'Zahraoui', 'fatima.z@email.com',       '+212677890123', 'Rabat',      'Morocco', 'MA901234'),
('Carlos',   'Rodriguez','carlos.r@email.es',        '+34612345678',  'Madrid',     'Spain',   'ES567890')
ON DUPLICATE KEY UPDATE email = email;

-- Reservations
INSERT INTO reservations (reservation_no, client_id, room_id, check_in_date, check_out_date, adults, children, total_price, status, payment_status) VALUES
('RES-2025-001', 1, 3, '2025-05-01', '2025-05-05', 2, 0, 4800.00,  'CHECKED_OUT', 'PAID'),
('RES-2025-002', 2, 5, '2025-05-10', '2025-05-14', 2, 0, 10000.00, 'CHECKED_OUT', 'PAID'),
('RES-2025-003', 3, 4, '2025-05-12', '2025-05-15', 2, 0, 3600.00,  'CHECKED_IN',  'PARTIAL'),
('RES-2025-004', 4, 6, '2025-05-15', '2025-05-18', 2, 1, 8400.00,  'CONFIRMED',   'UNPAID'),
('RES-2025-005', 5, 1, '2025-05-20', '2025-05-22', 1, 0, 1600.00,  'PENDING',     'UNPAID')
ON DUPLICATE KEY UPDATE reservation_no = reservation_no;

-- Employees
INSERT INTO employees (first_name, last_name, email, phone, position, department, salary, hire_date, active) VALUES
('Karim',   'Alaoui',   'k.alaoui@luxestay.com',   '+212661000001', 'MANAGER',     'Direction',   15000.00, '2020-01-15', TRUE),
('Nadia',   'Bensouda', 'n.bensouda@luxestay.com', '+212661000002', 'RECEPTIONIST','Front Office', 6000.00, '2021-03-01', TRUE),
('Hassan',  'Tazi',     'h.tazi@luxestay.com',     '+212661000003', 'HOUSEKEEPER', 'Housekeeping', 4500.00, '2021-06-15', TRUE),
('Youssef', 'Idrissi',  'y.idrissi@luxestay.com',  '+212661000004', 'MAINTENANCE', 'Technique',    5000.00, '2022-01-10', TRUE),
('Sara',    'Chraibi',  's.chraibi@luxestay.com',  '+212661000005', 'CHEF',        'Restaurant',   8000.00, '2020-09-01', TRUE),
('Omar',    'Kettani',  'o.kettani@luxestay.com',  '+212661000006', 'SECURITY',    'Sécurité',     4800.00, '2023-02-01', TRUE)
ON DUPLICATE KEY UPDATE email = email;
