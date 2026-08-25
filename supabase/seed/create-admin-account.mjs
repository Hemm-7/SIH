// Provisions a single test admin account.
//
//   node supabase/seed/create-admin-account.mjs
//
// Needed because /dashboard is now gated to profiles.user_type = 'admin'
// (Task 1d), and no admin account existed to test against. Same pattern as
// link-institution-admins.mjs: service-role, idempotent, verifies every write
// by re-reading per Global Rule #15 rather than trusting the PATCH status —
// a filtered write on this project returns HTTP 200 with an empty body, not
// an error.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const env = {};
readFileSync(resolve(projectRoot, ".env"), "utf8").split(/\r?\n/).forEach((l) => {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
});

const URL_ = env.VITE_SUPABASE_URL;
const SR = env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: SR, Authorization: `Bearer ${SR}`, "Content-Type": "application/json" };

const ACCOUNT = {
  email: "admin.test@sih26043.local",
  password: process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026-set-SEED_ADMIN_PASSWORD",
  fullName: "Test Department Admin",
  userType: "admin",
};

async function findUserByEmail(email) {
  const r = await fetch(`${URL_}/auth/v1/admin/users?per_page=200`, { headers: H });
  const j = await r.json();
  return (j.users ?? []).find((u) => u.email === email) ?? null;
}

console.log(`--- ${ACCOUNT.userType}: ${ACCOUNT.email} ---`);

let user = await findUserByEmail(ACCOUNT.email);
if (user) {
  console.log(`  user exists            ${user.id}`);
} else {
  const r = await fetch(`${URL_}/auth/v1/admin/users`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      email: ACCOUNT.email,
      password: ACCOUNT.password,
      email_confirm: true,
      user_metadata: { full_name: ACCOUNT.fullName },
    }),
  });
  if (!r.ok) { console.error(`  FAILED to create: ${await r.text()}`); process.exit(1); }
  user = await r.json();
  console.log(`  user created           ${user.id}`);
}

// The signup trigger defaults every profile to the citizen role; the admin role
// is only ever assigned here, service-side — same reasoning as the institution
// accounts (profiles.user_type is self-writable under current RLS, so this must
// never be something a user can grant themselves).
const pr = await fetch(`${URL_}/rest/v1/profiles?user_id=eq.${user.id}`, {
  method: "PATCH",
  headers: { ...H, Prefer: "return=representation" },
  body: JSON.stringify({ user_type: ACCOUNT.userType, full_name: ACCOUNT.fullName }),
});
const prBody = await pr.json();
if (!Array.isArray(prBody) || prBody.length === 0) {
  console.error(`  PROFILE WRITE NO-OP (HTTP ${pr.status}) — nothing updated`);
  process.exit(1);
}
console.log(`  profile.user_type      ${prBody[0].user_type}`);

// ---- verification: re-read, never trust the write status alone ----
console.log(`\n=== verification (re-read, per Global Rule #15) ===`);
const check = await (
  await fetch(`${URL_}/rest/v1/profiles?select=email,user_type&user_id=eq.${user.id}`, { headers: H })
).json();
console.log(`  ${check[0].email} -> ${check[0].user_type}`);
if (check[0].user_type !== "admin") {
  console.error(`  MISMATCH — expected admin`);
  process.exit(1);
}
console.log(`  OK`);
