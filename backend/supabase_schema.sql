-- ============================================================
-- SmartHealthAI — Supabase Database Schema
-- Run this entire script in: Supabase → SQL Editor → New Query
-- ============================================================

-- ── 1. Patients / Government Queue ──────────────────────────
CREATE TABLE IF NOT EXISTS patients (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  token           TEXT NOT NULL UNIQUE,
  patient_name    TEXT NOT NULL,
  department      TEXT NOT NULL DEFAULT 'General Medicine',
  priority        TEXT NOT NULL DEFAULT 'Low',   -- Low | Medium | High
  status          TEXT NOT NULL DEFAULT 'Waiting', -- Waiting | In Consultation | Completed
  age             TEXT,
  mobile          TEXT,
  gender          TEXT,
  aadhaar_id      TEXT,
  symptoms        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. Token Counter (auto-increments per registration) ─────
CREATE TABLE IF NOT EXISTS token_counter (
  id            INT PRIMARY KEY DEFAULT 1,
  current_value INT NOT NULL DEFAULT 105
);

-- Seed with starting value (only inserts if empty)
INSERT INTO token_counter (id, current_value)
VALUES (1, 105)
ON CONFLICT (id) DO NOTHING;

-- ── 3. Seed initial patients ─────────────────────────────────
INSERT INTO patients (token, patient_name, department, priority, status)
VALUES
  ('A101', 'Ravi Kumar',   'Cardiology',       'High',   'Waiting'),
  ('A102', 'Priya Sharma', 'Dermatology',      'Low',    'In Consultation'),
  ('A103', 'Rahul Mehta',  'Orthopedics',      'Medium', 'Completed'),
  ('A104', 'Saira Begum',  'General Medicine', 'Medium', 'Waiting')
ON CONFLICT (token) DO NOTHING;

-- ── 4. Department Queues ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS department_queues (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  department   TEXT NOT NULL UNIQUE,
  queue_count  INT  NOT NULL DEFAULT 0,
  wait_time    TEXT NOT NULL DEFAULT '20 min',
  status       TEXT NOT NULL DEFAULT 'Available'  -- Available | Moderate | Busy
);

INSERT INTO department_queues (department, queue_count, wait_time, status)
VALUES
  ('General Medicine', 18, '35 min', 'Busy'),
  ('Cardiology',       14, '28 min', 'Busy'),
  ('Neurology',         9, '22 min', 'Moderate'),
  ('Orthopedics',      11, '25 min', 'Moderate'),
  ('Dermatology',       5, '12 min', 'Available')
ON CONFLICT (department) DO NOTHING;

-- ── 5. Reception Stats (single row, mutated on registration) ─
CREATE TABLE IF NOT EXISTS reception_stats (
  id                         INT PRIMARY KEY DEFAULT 1,
  patients_registered_today  INT NOT NULL DEFAULT 148,
  waiting_patients           INT NOT NULL DEFAULT 36,
  completed_consultations    INT NOT NULL DEFAULT 92,
  emergency_cases            INT NOT NULL DEFAULT 11
);

INSERT INTO reception_stats (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ── 6. Enable Row Level Security (RLS) — allow all for now ───
ALTER TABLE patients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_counter     ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE reception_stats   ENABLE ROW LEVEL SECURITY;

-- Allow full access via service_role key (used by backend)
CREATE POLICY "service_role full access" ON patients
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role full access" ON token_counter
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role full access" ON department_queues
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role full access" ON reception_stats
  USING (true) WITH CHECK (true);
