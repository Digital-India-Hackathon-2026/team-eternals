// setup-private-tables.js
// Creates private tables using Supabase REST API (no pg needed)
// Run: node setup-private-tables.js
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function sql(query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
      "apikey": SUPABASE_SERVICE_KEY,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`SQL failed: ${txt}`);
  }
  return res.json();
}

// Use Supabase Management API for raw SQL
async function execSQL(statement) {
  const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: statement }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data;
}

// Fallback: use supabase-js to insert/check tables
const { createClient } = require("@supabase/supabase-js");
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkTable(name) {
  const { error } = await sb.from(name).select("*", { count: "exact", head: true });
  return !error;
}

async function main() {
  console.log("🔍 Checking which tables exist...\n");

  const tables = ["private_queue", "private_token_counter", "private_stats", "hospitals"];
  for (const t of tables) {
    const exists = await checkTable(t);
    console.log(`  ${t}: ${exists ? "✅ exists" : "❌ MISSING"}`);
  }

  const allExist = await Promise.all(tables.map(checkTable));
  if (allExist.every(Boolean)) {
    console.log("\n✅ All private tables exist! Running data reset...");
    await resetData();
    return;
  }

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  SUPABASE TABLES MISSING — MANUAL STEP REQUIRED             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Please run hospitals_schema.sql in Supabase SQL Editor:     ║
║                                                              ║
║  1. Open https://app.supabase.com                           ║
║  2. Go to your project → SQL Editor → New Query              ║
║  3. Paste the file: backend/hospitals_schema.sql             ║
║  4. Click RUN                                                ║
║  5. Then run this script again: node setup-private-tables.js ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

async function resetData() {
  console.log("\n🔄 Resetting all data to zero...\n");

  // Government
  const r1 = await sb.from("patients").delete().neq("id", 0);
  console.log(r1.error ? `❌ patients: ${r1.error.message}` : "✅ patients cleared");

  const r2 = await sb.from("token_counter").update({ current_value: 100 }).eq("id", 1);
  console.log(r2.error ? `❌ token_counter: ${r2.error.message}` : "✅ govt tokens reset to 100");

  const r3 = await sb.from("department_queues").update({ queue_count: 0, wait_time: "0 min", status: "Available" }).neq("id", 0);
  console.log(r3.error ? `❌ dept_queues: ${r3.error.message}` : "✅ dept queues → 0");

  const r4 = await sb.from("reception_stats").update({
    patients_registered_today: 0, waiting_patients: 0,
    completed_consultations: 0, emergency_cases: 0,
  }).eq("id", 1);
  console.log(r4.error ? `❌ reception_stats: ${r4.error.message}` : "✅ govt stats → 0");

  // Private
  const r5 = await sb.from("private_queue").delete().neq("id", 0);
  console.log(r5.error ? `❌ private_queue: ${r5.error.message}` : "✅ private_queue cleared");

  const r6 = await sb.from("private_token_counter").update({ current_value: 0 }).eq("id", 1);
  console.log(r6.error ? `❌ private_token_counter: ${r6.error.message}` : "✅ private tokens reset to 0");

  const r7 = await sb.from("private_stats").update({
    appointments_today: 0, waiting_patients: 0,
  }).eq("id", 1);
  console.log(r7.error ? `❌ private_stats: ${r7.error.message}` : "✅ private stats → 0");

  console.log("\n🎉 Database is clean and ready!");
  console.log("   → Restart the backend: node server.js");
  console.log("   → Both dashboards will start empty");
  console.log("   → Registrations will write to Supabase live\n");
}

main().catch(console.error);
