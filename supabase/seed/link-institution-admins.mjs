// Provisions institution test accounts and links them to seeded institutions.
//
//   node supabase/seed/link-institution-admins.mjs
//
// Needed because institutions.admin_user_id is NULL on every seeded row, and the
// claim policy on challenge_matches gates entirely on
// `institutions.admin_user_id = auth.uid()`. Until a real account is linked, the
// Task 5 claim flow cannot be exercised end to end by anyone.
//
// Uses the service-role key: creating auth users and setting profiles.user_type to
// an institution role are both deliberately NOT things a user may do for themselves.
// Idempotent — safe to re-run.

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

const ACCOUNTS = [
  {
    email: "university.test@sih26043.local",
    password: process.env.SEED_UNIVERSITY_PASSWORD ?? "ChangeMe!2026-set-SEED_UNIVERSITY_PASSWORD",
    fullName: "Test University Admin",
    userType: "university",
    institutionName: "Ranchi Institute of Rural Technology",
  },
  {
    email: "industry.test@sih26043.local",
    password: process.env.SEED_INDUSTRY_PASSWORD ?? "ChangeMe!2026-set-SEED_INDUSTRY_PASSWORD",
    fullName: "Test Industry Admin",
    userType: "industry",
    institutionName: "Palamu Agri-Tech Innovations Pvt. Ltd.",
  },
];

async function findUserByEmail(email) {
  const r = await fetch(`${URL_}/auth/v1/admin/users?per_page=200`, { headers: H });
  const j = await r.json();
  return (j.users ?? []).find((u) => u.email === email) ?? null;
}

for (const acct of ACCOUNTS) {
  console.log(`\n--- ${acct.userType}: ${acct.email} ---`);

  let user = await findUserByEmail(acct.email);
  if (user) {
    console.log(`  user exists            ${user.id}`);
  } else {
    const r = await fetch(`${URL_}/auth/v1/admin/users`, {
      method: "POST",
      headers: H,
      body: JSON.stringify({
        email: acct.email,
        password: acct.password,
        email_confirm: true,
        user_metadata: { full_name: acct.fullName },
      }),
    });
    if (!r.ok) { console.error(`  FAILED to create: ${await r.text()}`); continue; }
    user = await r.json();
    console.log(`  user created           ${user.id}`);
  }

  // The signup trigger defaults every profile to the citizen role; institution
  // roles are only ever assigned here, service-side.
  const pr = await fetch(`${URL_}/rest/v1/profiles?user_id=eq.${user.id}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify({ user_type: acct.userType, full_name: acct.fullName }),
  });
  const prBody = await pr.json();
  // Global Rule #15: a filtered write returns 200 with []. Verify by re-reading.
  if (!Array.isArray(prBody) || prBody.length === 0) {
    console.error(`  PROFILE WRITE NO-OP (HTTP ${pr.status}) — nothing updated`);
    continue;
  }
  console.log(`  profile.user_type      ${prBody[0].user_type}`);

  const instRes = await fetch(
    `${URL_}/rest/v1/institutions?select=id,name&name=eq.${encodeURIComponent(acct.institutionName)}`,
    { headers: H },
  );
  const insts = await instRes.json();
  if (insts.length === 0) { console.error(`  institution not found: ${acct.institutionName}`); continue; }

  const linkRes = await fetch(`${URL_}/rest/v1/institutions?id=eq.${insts[0].id}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify({ admin_user_id: user.id }),
  });
  const linkBody = await linkRes.json();
  if (!Array.isArray(linkBody) || linkBody.length === 0) {
    console.error(`  INSTITUTION LINK NO-OP (HTTP ${linkRes.status})`);
    continue;
  }
  console.log(`  linked institution     ${insts[0].name}`);
  console.log(`  admin_user_id          ${linkBody[0].admin_user_id}`);
}

// ---- verification: re-read everything, never trust the write status alone ----
console.log(`\n=== verification (re-read, per Global Rule #15) ===`);
const linked = await (
  await fetch(`${URL_}/rest/v1/institutions?select=name,admin_user_id&admin_user_id=not.is.null`, { headers: H })
).json();
console.log(`institutions with an admin linked: ${linked.length}`);
linked.forEach((i) => console.log(`  ${i.name} -> ${i.admin_user_id}`));

const profs = await (
  await fetch(`${URL_}/rest/v1/profiles?select=email,user_type&user_type=in.(university,industry)`, { headers: H })
).json();
console.log(`institution-role profiles: ${profs.length}`);
profs.forEach((p) => console.log(`  ${p.email} -> ${p.user_type}`));
