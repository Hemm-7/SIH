// Loads supabase/seed/institutions.json into public.institutions.
//
//   node supabase/seed/load-institutions.mjs
//
// Uses the service-role key, which bypasses RLS — the institutions table's write
// policy is admin-only ("Admins can manage institutions"), and seeding happens
// before any admin account exists. Server-side only; never import this from client code.
//
// Idempotent: institutions has no unique constraint on `name`, so re-running a naive
// insert would silently duplicate the whole directory and corrupt match candidates.
// This reads existing names first and inserts only what's missing.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "../..");

// Minimal .env reader — avoids adding a dotenv dependency for a one-file script.
function readEnv() {
  const raw = readFileSync(resolve(projectRoot, ".env"), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = readEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

const rows = JSON.parse(
  readFileSync(resolve(here, "institutions.json"), "utf8"),
);

const existingRes = await fetch(`${url}/rest/v1/institutions?select=name`, { headers });
if (!existingRes.ok) {
  console.error(`Failed to read institutions: ${existingRes.status} ${await existingRes.text()}`);
  process.exit(1);
}
const existing = new Set((await existingRes.json()).map((r) => r.name));

const missing = rows.filter((r) => !existing.has(r.name));

if (missing.length === 0) {
  console.log(`Nothing to do — all ${rows.length} institutions already present.`);
  process.exit(0);
}

const insertRes = await fetch(`${url}/rest/v1/institutions`, {
  method: "POST",
  headers: { ...headers, Prefer: "return=representation" },
  body: JSON.stringify(missing),
});

if (!insertRes.ok) {
  console.error(`Insert failed: ${insertRes.status} ${await insertRes.text()}`);
  process.exit(1);
}

const inserted = await insertRes.json();
console.log(`Inserted ${inserted.length} institutions (skipped ${rows.length - missing.length} already present).`);
