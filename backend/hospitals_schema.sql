-- ============================================================
-- SmartHealthAI — Hospitals & Private Hospital Schema
-- Run in: Supabase → SQL Editor → New Query
-- Run AFTER supabase_schema.sql
-- ============================================================

-- ── 1. Hospitals Master Table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hospitals (
  id              TEXT PRIMARY KEY,               -- e.g. "apollo-jubilee"
  name            TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'Private', -- 'Private' | 'Government'
  address         TEXT,
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,
  phone           TEXT,
  departments     TEXT[],                          -- array of dept names
  doctors         INT  DEFAULT 0,
  emergency_beds  INT  DEFAULT 0,
  total_beds      INT  DEFAULT 0,
  wait_time       TEXT DEFAULT '20 min',
  queue_count     INT  DEFAULT 0,
  rating          DOUBLE PRECISION DEFAULT 4.0,
  accredited      BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. Private OPD Queue ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS private_queue (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  token           TEXT NOT NULL UNIQUE,           -- P001, P002 …
  patient_name    TEXT NOT NULL,
  department      TEXT NOT NULL DEFAULT 'General Medicine',
  priority        TEXT NOT NULL DEFAULT 'Low',
  status          TEXT NOT NULL DEFAULT 'Waiting', -- Waiting | In Consultation | Completed
  appointment_type TEXT NOT NULL DEFAULT 'OPD',   -- OPD | Emergency | Follow-Up | Procedure
  age             TEXT,
  mobile          TEXT,
  gender          TEXT,
  symptoms        TEXT,
  hospital_id     TEXT REFERENCES hospitals(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. Private Token Counter ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS private_token_counter (
  id            INT PRIMARY KEY DEFAULT 1,
  current_value INT NOT NULL DEFAULT 0
);

INSERT INTO private_token_counter (id, current_value)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- ── 4. Private Hospital Stats (single-row summary) ────────────────────────────
CREATE TABLE IF NOT EXISTS private_stats (
  id                         INT PRIMARY KEY DEFAULT 1,
  appointments_today         INT NOT NULL DEFAULT 126,
  waiting_patients           INT NOT NULL DEFAULT 4,
  doctors_on_duty            INT NOT NULL DEFAULT 32,
  beds_available             INT NOT NULL DEFAULT 42
);

INSERT INTO private_stats (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ── 5. Seed all 25 Hyderabad hospitals ───────────────────────────────────────
INSERT INTO hospitals (id, name, type, address, lat, lng, phone, departments, doctors, emergency_beds, total_beds, wait_time, queue_count, rating, accredited)
VALUES
  ('apollo-jubilee',      'Apollo Hospitals Jubilee Hills',               'Private',    'Jubilee Hills, Hyderabad',        17.4239, 78.4108, '040-23607777', ARRAY['Cardiology','Neurology','Oncology','Orthopedics','General Medicine'],            68,  18,  710, '22 min', 14, 4.8, TRUE),
  ('apollo-health-city',  'Apollo Health City',                           'Private',    'Gachibowli, Hyderabad',           17.3616, 78.5466, '040-23607000', ARRAY['Cardiology','Transplant','Oncology','Neurology','Pediatrics'],                    120, 30, 1000, '28 min', 22, 4.9, TRUE),
  ('yashoda-secunderabad','Yashoda Hospitals Secunderabad',                'Private',    'Raj Bhavan Rd, Secunderabad',     17.4399, 78.4983, '040-44556600', ARRAY['Cardiology','Neurology','Orthopedics','Gastroenterology','General Medicine'],     55,  14,  600, '18 min', 10, 4.7, TRUE),
  ('yashoda-somajiguda',  'Yashoda Hospitals Somajiguda',                 'Private',    'Somajiguda, Hyderabad',           17.4266, 78.4543, '040-44556000', ARRAY['Neurology','Orthopedics','Dermatology','ENT','General Medicine'],                 48,  10,  430, '15 min',  8, 4.6, TRUE),
  ('kims-secunderabad',   'KIMS Hospital Secunderabad',                   'Private',    'Minister Rd, Secunderabad',       17.4459, 78.5037, '040-44885000', ARRAY['Cardiology','Pulmonology','Orthopedics','Urology','General Medicine'],             62,  16,  650, '25 min', 18, 4.7, TRUE),
  ('care-hospitals',      'CARE Hospitals',                               'Private',    'Nampally, Hyderabad',             17.3950, 78.4867, '040-30418888', ARRAY['Cardiology','Neurology','Orthopedics','Oncology','General Medicine'],              74,  20,  550, '20 min', 15, 4.6, TRUE),
  ('aig-hospitals',       'AIG Hospitals',                                'Private',    'Mindspace, Gachibowli',           17.4903, 78.3816, '040-42444222', ARRAY['Gastroenterology','Hepatology','Bariatric Surgery','General Medicine'],           40,   8,  350, '12 min',  6, 4.8, TRUE),
  ('continental-hospital','Continental Hospitals',                         'Private',    'Tellapur, Hyderabad',             17.4100, 78.3467, '040-67000167', ARRAY['Cardiology','Neurosurgery','Orthopedics','Oncology','Pediatrics'],                55,  15,  600, '18 min', 12, 4.5, TRUE),
  ('gandhi-hospital',     'Gandhi Hospital',                              'Government', 'Musheerabad, Hyderabad',          17.4497, 78.4906, '040-27505566', ARRAY['General Medicine','Surgery','Orthopedics','Gynecology','Pediatrics'],             110, 35, 1200, '45 min', 40, 3.8, FALSE),
  ('osmania-hospital',    'Osmania General Hospital',                     'Government', 'Afzalgunj, Hyderabad',            17.3853, 78.4731, '040-24600019', ARRAY['General Medicine','Surgery','ENT','Dermatology','Psychiatry'],                    130, 40, 1400, '55 min', 52, 3.6, FALSE),
  ('nims',                'NIMS (Nizams Institute of Medical Sciences)',   'Government', 'Punjagutta, Hyderabad',           17.3951, 78.4564, '040-23489000', ARRAY['Neurology','Neurosurgery','Cardiology','Oncology','General Medicine'],             95,  28,  900, '38 min', 32, 4.0, TRUE),
  ('tims',                'TIMS (Telangana Institute of Medical Sciences)','Government', 'Gachibowli, Hyderabad',           17.4947, 78.3543, '040-23118888', ARRAY['General Medicine','Surgery','Orthopedics','Gynecology','Pediatrics'],             70,  20,  700, '42 min', 35, 3.9, FALSE),
  ('star-hospital',       'Star Hospitals',                               'Private',    'Banjara Hills, Hyderabad',        17.4040, 78.4477, '040-44777999', ARRAY['Cardiology','Neurology','Orthopedics','ENT','General Medicine'],                  45,  12,  400, '20 min', 11, 4.4, TRUE),
  ('omega-hospital',      'Omega Hospital',                               'Private',    'Madhapur, Hyderabad',             17.4303, 78.3906, '040-23560777', ARRAY['Oncology','Bone Marrow Transplant','Hematology'],                                30,   6,  200, '16 min',  5, 4.6, TRUE),
  ('sunshine-hospital',   'Sunshine Hospitals',                           'Private',    'Begumpet, Hyderabad',             17.4388, 78.4052, '040-44655000', ARRAY['Orthopedics','Sports Medicine','Physiotherapy','General Surgery'],                35,   8,  280, '14 min',  7, 4.5, TRUE),
  ('maxcure-hospital',    'Maxcure Hospital',                             'Private',    'Hitech City, Hyderabad',          17.4235, 78.4485, '040-48486868', ARRAY['Cardiology','Neurology','Gastroenterology','Pediatrics'],                        42,  10,  320, '19 min',  9, 4.3, TRUE),
  ('citizens-hospital',   'Citizens Specialty Hospital',                  'Private',    'Nallagandla, Hyderabad',          17.4067, 78.5517, '040-67191919', ARRAY['Cardiology','Neurology','Orthopedics','Oncology','Renal'],                        50,  12,  350, '22 min', 13, 4.4, TRUE),
  ('medicover-hospital',  'Medicover Hospitals',                          'Private',    'Hitech City, Hyderabad',          17.4419, 78.3870, '040-68888888', ARRAY['Cardiology','Orthopedics','Dermatology','General Medicine','ENT'],                38,   8,  260, '13 min',  6, 4.2, TRUE),
  ('tulip-hospital',      'Tulip Hospital',                               'Private',    'Kondapur, Hyderabad',             17.4527, 78.3769, '040-40150000', ARRAY['Pediatrics','Neonatology','Gynecology','General Medicine'],                       28,   6,  180, '10 min',  4, 4.3, TRUE),
  ('rainbow-hospital',    'Rainbow Childrens Hospital',                   'Private',    'Banjara Hills, Hyderabad',        17.4315, 78.4130, '040-44447777', ARRAY['Pediatrics','Neonatology','Pediatric Surgery','Pediatric Neurology'],             52,  14,  340, '17 min',  8, 4.7, TRUE),
  ('secunderabad-govt',   'Government District Hospital Secunderabad',    'Government', 'Patny, Secunderabad',             17.4499, 78.5067, '040-27803145', ARRAY['General Medicine','Surgery','Gynecology','ENT'],                                  45,  15,  400, '50 min', 38, 3.5, FALSE),
  ('govt-maternity',      'Govt. Maternity Hospital Hyderabad',           'Government', 'Petlaburj, Hyderabad',            17.3814, 78.4690, '040-24563541', ARRAY['Gynecology','Obstetrics','Neonatology','Pediatrics'],                             40,  12,  300, '35 min', 28, 3.7, FALSE),
  ('basavatarakam',       'Basavatarakam Indo-American Cancer Hospital',  'Private',    'Banjara Hills, Hyderabad',        17.4190, 78.3984, '040-23551235', ARRAY['Oncology','Radiation Therapy','Surgical Oncology','Palliative Care'],            36,   6,  240, '25 min', 10, 4.6, TRUE),
  ('global-hospital',     'Global Hospitals',                             'Private',    'Lakdi ka Pul, Hyderabad',         17.3892, 78.4538, '040-30244444', ARRAY['Transplant','Hepatology','Nephrology','Cardiology','Neurology'],                  58,  16,  500, '24 min', 14, 4.5, TRUE),
  ('lvpei',               'L V Prasad Eye Institute',                     'Private',    'Banjara Hills, Hyderabad',        17.4263, 78.4358, '040-30612525', ARRAY['Ophthalmology','Retina','Cornea','Glaucoma','Pediatric Ophthalmology'],           60,   8,  280, '20 min', 15, 4.9, TRUE)
ON CONFLICT (id) DO UPDATE SET
  queue_count   = EXCLUDED.queue_count,
  wait_time     = EXCLUDED.wait_time,
  is_active     = TRUE;

-- ── 4. No initial private queue data (start fresh) ─────────────────────────
-- Patients will be registered via the OPD Registration form

-- ── 5. Reset private stats to zero ──────────────────────────────────────────
INSERT INTO private_stats (id, appointments_today, waiting_patients, doctors_on_duty, beds_available)
VALUES (1, 0, 0, 32, 42)
ON CONFLICT (id) DO UPDATE SET
  appointments_today = 0,
  waiting_patients   = 0;

-- ── 7. RLS Policies ──────────────────────────────────────────────────────────
ALTER TABLE hospitals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_queue         ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_token_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_stats         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role full access" ON hospitals
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role full access" ON private_queue
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role full access" ON private_token_counter
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role full access" ON private_stats
  USING (true) WITH CHECK (true);
