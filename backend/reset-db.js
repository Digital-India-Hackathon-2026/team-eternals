// reset-db.js — Clears all demo/seed data from Supabase
// Run with: node reset-db.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function reset() {
  console.log("🔄 Resetting SmartHealthAI database...\n");

  // ── Government side ──────────────────────────────────────────
  const { error: e1 } = await supabase.from("patients").delete().neq("id", 0);
  console.log(e1 ? `❌ patients delete: ${e1.message}` : "✅ patients table cleared");

  const { error: e2 } = await supabase.from("token_counter").update({ current_value: 100 }).eq("id", 1);
  console.log(e2 ? `❌ token_counter reset: ${e2.message}` : "✅ govt token counter → 100 (next = A101)");

  const { error: e3 } = await supabase.from("department_queues").update({
    queue_count: 0, wait_time: "0 min", status: "Available"
  }).neq("id", 0);
  console.log(e3 ? `❌ dept_queues reset: ${e3.message}` : "✅ department queues → 0");

  const { error: e4 } = await supabase.from("reception_stats").update({
    patients_registered_today: 0,
    waiting_patients: 0,
    completed_consultations: 0,
    emergency_cases: 0,
  }).eq("id", 1);
  console.log(e4 ? `❌ reception_stats reset: ${e4.message}` : "✅ govt stats → 0");

  // ── Private side ─────────────────────────────────────────────
  const { error: e5 } = await supabase.from("private_queue").delete().neq("id", 0);
  console.log(e5 ? `❌ private_queue delete: ${e5.message}` : "✅ private_queue table cleared");

  const { error: e6 } = await supabase.from("private_token_counter").update({ current_value: 0 }).eq("id", 1);
  console.log(e6 ? `❌ private_token_counter reset: ${e6.message}` : "✅ private token counter → 0 (next = P001)");

  const { error: e7 } = await supabase.from("private_stats").update({
    appointments_today: 0,
    waiting_patients: 0,
  }).eq("id", 1);
  console.log(e7 ? `❌ private_stats reset: ${e7.message}` : "✅ private stats → 0");

  // ── Verify ───────────────────────────────────────────────────
  console.log("\n📊 Verification:");
  const { count: gc } = await supabase.from("patients").select("*", { count: "exact", head: true });
  const { count: pc } = await supabase.from("private_queue").select("*", { count: "exact", head: true });
  const { data: gs } = await supabase.from("reception_stats").select("*").eq("id", 1).single();
  const { data: ps } = await supabase.from("private_stats").select("*").eq("id", 1).single();

  console.log(`  Govt patients:    ${gc ?? "?"}`);
  console.log(`  Private patients: ${pc ?? "?"}`);
  console.log(`  Govt stats:       registered=${gs?.patients_registered_today}, waiting=${gs?.waiting_patients}`);
  console.log(`  Private stats:    today=${ps?.appointments_today}, waiting=${ps?.waiting_patients}`);
  console.log("\n✅ Database is clean and ready!");
}

reset().catch(console.error);
