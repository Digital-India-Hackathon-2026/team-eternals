#!/usr/bin/env node
/**
 * SmartHealthAI — Supabase Connection Test
 * Run: node test-db.js
 */
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || url === "YOUR_SUPABASE_PROJECT_URL") {
  console.error("❌  SUPABASE_URL not set in .env");
  process.exit(1);
}
if (!key || key === "YOUR_SUPABASE_SERVICE_ROLE_KEY") {
  console.error("❌  SUPABASE_SERVICE_KEY not set in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  console.log("🔗  Connecting to Supabase:", url);

  // Test 1: patients table
  const { data: patients, error: pErr } = await supabase
    .from("patients")
    .select("token, patient_name, status")
    .limit(5);

  if (pErr) {
    console.error("❌  patients table error:", pErr.message);
    console.log("    → Did you run supabase_schema.sql in the SQL Editor?");
    process.exit(1);
  }
  console.log(`✅  patients table — ${patients.length} rows found`);
  patients.forEach((p) => console.log(`     ${p.token} | ${p.patient_name} | ${p.status}`));

  // Test 2: department_queues
  const { data: depts, error: dErr } = await supabase
    .from("department_queues")
    .select("department, queue_count, status");

  if (dErr) {
    console.error("❌  department_queues table error:", dErr.message);
    process.exit(1);
  }
  console.log(`✅  department_queues — ${depts.length} departments`);

  // Test 3: reception_stats
  const { data: stats, error: sErr } = await supabase
    .from("reception_stats")
    .select("*")
    .eq("id", 1)
    .single();

  if (sErr) {
    console.error("❌  reception_stats error:", sErr.message);
    process.exit(1);
  }
  console.log("✅  reception_stats:", JSON.stringify(stats));

  // Test 4: token_counter
  const { data: counter, error: cErr } = await supabase
    .from("token_counter")
    .select("current_value")
    .eq("id", 1)
    .single();

  if (cErr) {
    console.error("❌  token_counter error:", cErr.message);
    process.exit(1);
  }
  console.log("✅  token_counter — next token will be: A" + counter.current_value);

  console.log("\n🎉  All tables connected successfully! You can now start the server.");
}

run().catch((e) => {
  console.error("Unexpected error:", e.message);
  process.exit(1);
});
