-- ============================================================
-- SmartHealthAI — FULL CLEAN RESET
-- Run this in: Supabase → SQL Editor → New Query
-- This wipes ALL seeded/demo data and starts fresh.
-- ============================================================

-- ── 1. Clear government queue ──────────────────────────────────
DELETE FROM patients;

-- Reset token counter back to 100 (next token = A101)
UPDATE token_counter SET current_value = 100 WHERE id = 1;

-- ── 2. Reset department queue counts to zero ──────────────────
UPDATE department_queues SET
  queue_count = 0,
  wait_time   = '0 min',
  status      = 'Available';

-- ── 3. Reset government reception stats to zero ───────────────
UPDATE reception_stats SET
  patients_registered_today = 0,
  waiting_patients          = 0,
  completed_consultations   = 0,
  emergency_cases           = 0
WHERE id = 1;

-- ── 4. Clear private OPD queue ────────────────────────────────
DELETE FROM private_queue;

-- Reset private token counter to 0 (next = P001)
UPDATE private_token_counter SET current_value = 0 WHERE id = 1;

-- ── 5. Reset private stats to zero ───────────────────────────
UPDATE private_stats SET
  appointments_today = 0,
  waiting_patients   = 0
WHERE id = 1;

-- ── 6. Verify all tables are empty ───────────────────────────
SELECT 'patients'       AS tbl, COUNT(*) AS rows FROM patients
UNION ALL
SELECT 'private_queue'  AS tbl, COUNT(*) AS rows FROM private_queue
UNION ALL
SELECT 'dept_queues'    AS tbl, SUM(queue_count) AS rows FROM department_queues;
