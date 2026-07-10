// create-tables.js — creates all private tables via Supabase Management API
// Run: node create-tables.js
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace("https://", "").split(".")[0];
console.log("Project ref:", projectRef);

async function execSQL(sql) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  const data = await res.json().catch(() => res.text());
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

const STATEMENTS = [
  // hospitals
  `CREATE TABLE IF NOT EXISTS hospitals (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    type            TEXT NOT NULL DEFAULT 'Private',
    address         TEXT,
    lat             DOUBLE PRECISION,
    lng             DOUBLE PRECISION,
    phone           TEXT,
    departments     TEXT[],
    doctors         INT  DEFAULT 0,
    emergency_beds  INT  DEFAULT 0,
    total_beds      INT  DEFAULT 0,
    wait_time       TEXT DEFAULT '0 min',
    queue_count     INT  DEFAULT 0,
    rating          DOUBLE PRECISION DEFAULT 4.0,
    accredited      BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='hospitals' AND policyname='service_role full access') THEN
      CREATE POLICY "service_role full access" ON hospitals USING (true) WITH CHECK (true);
    END IF;
  END $$`,

  // private_queue
  `CREATE TABLE IF NOT EXISTS private_queue (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token            TEXT NOT NULL UNIQUE,
    patient_name     TEXT NOT NULL,
    department       TEXT NOT NULL DEFAULT 'General Medicine',
    priority         TEXT NOT NULL DEFAULT 'Low',
    status           TEXT NOT NULL DEFAULT 'Waiting',
    appointment_type TEXT NOT NULL DEFAULT 'OPD',
    age              TEXT,
    mobile           TEXT,
    gender           TEXT,
    symptoms         TEXT,
    hospital_id      TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `ALTER TABLE private_queue ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='private_queue' AND policyname='service_role full access') THEN
      CREATE POLICY "service_role full access" ON private_queue USING (true) WITH CHECK (true);
    END IF;
  END $$`,

  // private_token_counter
  `CREATE TABLE IF NOT EXISTS private_token_counter (
    id            INT PRIMARY KEY DEFAULT 1,
    current_value INT NOT NULL DEFAULT 0
  )`,
  `ALTER TABLE private_token_counter ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='private_token_counter' AND policyname='service_role full access') THEN
      CREATE POLICY "service_role full access" ON private_token_counter USING (true) WITH CHECK (true);
    END IF;
  END $$`,
  `INSERT INTO private_token_counter (id, current_value) VALUES (1, 0) ON CONFLICT (id) DO NOTHING`,

  // private_stats
  `CREATE TABLE IF NOT EXISTS private_stats (
    id                 INT PRIMARY KEY DEFAULT 1,
    appointments_today INT NOT NULL DEFAULT 0,
    waiting_patients   INT NOT NULL DEFAULT 0,
    doctors_on_duty    INT NOT NULL DEFAULT 32,
    beds_available     INT NOT NULL DEFAULT 42
  )`,
  `ALTER TABLE private_stats ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='private_stats' AND policyname='service_role full access') THEN
      CREATE POLICY "service_role full access" ON private_stats USING (true) WITH CHECK (true);
    END IF;
  END $$`,
  `INSERT INTO private_stats (id, appointments_today, waiting_patients, doctors_on_duty, beds_available)
   VALUES (1, 0, 0, 32, 42) ON CONFLICT (id) DO NOTHING`,

  // Seed hospitals
  `INSERT INTO hospitals (id, name, type, address, lat, lng, phone, departments, doctors, emergency_beds, total_beds, wait_time, queue_count, rating, accredited) VALUES
    ('apollo-jubilee','Apollo Hospitals Jubilee Hills','Private','Jubilee Hills, Hyderabad',17.4239,78.4108,'040-23607777',ARRAY['Cardiology','Neurology','Oncology','Orthopedics','General Medicine'],68,18,710,'0 min',0,4.8,TRUE),
    ('apollo-health-city','Apollo Health City','Private','Gachibowli, Hyderabad',17.3616,78.5466,'040-23607000',ARRAY['Cardiology','Transplant','Oncology','Neurology','Pediatrics'],120,30,1000,'0 min',0,4.9,TRUE),
    ('yashoda-secunderabad','Yashoda Hospitals Secunderabad','Private','Raj Bhavan Rd, Secunderabad',17.4399,78.4983,'040-44556600',ARRAY['Cardiology','Neurology','Orthopedics','General Medicine'],55,14,600,'0 min',0,4.7,TRUE),
    ('kims-secunderabad','KIMS Hospital Secunderabad','Private','Minister Rd, Secunderabad',17.4459,78.5037,'040-44885000',ARRAY['Cardiology','Pulmonology','Orthopedics','General Medicine'],62,16,650,'0 min',0,4.7,TRUE),
    ('care-hospitals','CARE Hospitals','Private','Nampally, Hyderabad',17.3950,78.4867,'040-30418888',ARRAY['Cardiology','Neurology','Orthopedics','Oncology','General Medicine'],74,20,550,'0 min',0,4.6,TRUE),
    ('gandhi-hospital','Gandhi Hospital','Government','Musheerabad, Hyderabad',17.4497,78.4906,'040-27505566',ARRAY['General Medicine','Surgery','Orthopedics','Gynecology','Pediatrics'],110,35,1200,'0 min',0,3.8,FALSE),
    ('osmania-hospital','Osmania General Hospital','Government','Afzalgunj, Hyderabad',17.3853,78.4731,'040-24600019',ARRAY['General Medicine','Surgery','ENT','Dermatology','Psychiatry'],130,40,1400,'0 min',0,3.6,FALSE),
    ('nims','NIMS','Government','Punjagutta, Hyderabad',17.3951,78.4564,'040-23489000',ARRAY['Neurology','Neurosurgery','Cardiology','Oncology','General Medicine'],95,28,900,'0 min',0,4.0,TRUE),
    ('star-hospital','Star Hospitals','Private','Banjara Hills, Hyderabad',17.4040,78.4477,'040-44777999',ARRAY['Cardiology','Neurology','Orthopedics','ENT','General Medicine'],45,12,400,'0 min',0,4.4,TRUE),
    ('rainbow-hospital','Rainbow Childrens Hospital','Private','Banjara Hills, Hyderabad',17.4315,78.4130,'040-44447777',ARRAY['Pediatrics','Neonatology','Pediatric Surgery'],52,14,340,'0 min',0,4.7,TRUE),
    ('global-hospital','Global Hospitals','Private','Lakdi ka Pul, Hyderabad',17.3892,78.4538,'040-30244444',ARRAY['Transplant','Hepatology','Nephrology','Cardiology','Neurology'],58,16,500,'0 min',0,4.5,TRUE),
    ('lvpei','L V Prasad Eye Institute','Private','Banjara Hills, Hyderabad',17.4263,78.4358,'040-30612525',ARRAY['Ophthalmology','Retina','Cornea','Glaucoma'],60,8,280,'0 min',0,4.9,TRUE)
  ON CONFLICT (id) DO NOTHING`,
];

async function main() {
  console.log("🏗️  Creating private hospital tables in Supabase...\n");

  for (const [i, stmt] of STATEMENTS.entries()) {
    const label = stmt.trim().split(/\s+/).slice(0, 4).join(" ");
    try {
      await execSQL(stmt);
      console.log(`✅ [${i+1}/${STATEMENTS.length}] ${label}…`);
    } catch (err) {
      if (err.message.includes("already exists") || err.message.includes("duplicate")) {
        console.log(`⏭️  [${i+1}/${STATEMENTS.length}] Already exists — skipped`);
      } else {
        console.error(`❌ [${i+1}/${STATEMENTS.length}] ${label}… FAILED: ${err.message}`);
      }
    }
  }

  // Final verification using supabase-js
  const { createClient } = require("@supabase/supabase-js");
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log("\n📊 Verification:");
  for (const t of ["private_queue", "private_token_counter", "private_stats", "hospitals"]) {
    const { count, error } = await sb.from(t).select("*", { count: "exact", head: true });
    console.log(`  ${t}: ${error ? `❌ ${error.message}` : `✅ ${count} rows`}`);
  }

  console.log("\n🎉 Done! Now restart the backend: node server.js");
}

main().catch(console.error);
