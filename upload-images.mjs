// LilMed · push all local product images to Supabase Storage and repoint the DB.
// Run from the project root:  node upload-images.mjs
//
// Requires a .env.local (or env vars) with:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   (Supabase → Project Settings → API → service_role)
//
// It:
//   1. reads every product row from Supabase,
//   2. finds the matching file under ./public for its image_url,
//   3. uploads it to the "product-images" bucket (skips ones already uploaded),
//   4. updates products.image_url to the public Supabase URL.

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

// tiny .env loader (no extra dependency needed)
for (const f of [".env.local", ".env"]) {
  if (!fs.existsSync(f)) continue;
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const URL_ = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local");
  process.exit(1);
}

const supabase = createClient(URL_, KEY, { auth: { persistSession: false } });
const BUCKET = "product-images";
const PUBLIC_DIR = path.resolve("public");

const MIME = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
};

function safeKey(rel) {
  return rel
    .replace(/^\/+/, "")
    .split("/")
    .map((p) => p.replace(/[^a-zA-Z0-9._-]+/g, "-"))
    .join("/");
}

const { data: products, error } = await supabase
  .from("products")
  .select("id,name,image_url")
  .limit(2000);
if (error) throw error;

console.log(`Found ${products.length} products.`);
let uploaded = 0, skipped = 0, missing = 0;

for (const p of products) {
  const src = p.image_url || "";
  if (!src) { missing++; continue; }
  if (src.startsWith("http")) { skipped++; continue; }        // already remote

  const localPath = path.join(PUBLIC_DIR, decodeURIComponent(src.replace(/^\//, "")));
  if (!fs.existsSync(localPath)) {
    console.warn(`  ! no local file for "${p.name}" -> ${src}`);
    missing++;
    continue;
  }

  const key = safeKey(decodeURIComponent(src));
  const ext = path.extname(localPath).toLowerCase();
  const body = fs.readFileSync(localPath);

  const up = await supabase.storage.from(BUCKET).upload(key, body, {
    contentType: MIME[ext] || "application/octet-stream",
    upsert: true,
    cacheControl: "31536000",
  });
  if (up.error) { console.error(`  x upload failed ${key}: ${up.error.message}`); continue; }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(key);
  const upd = await supabase.from("products").update({ image_url: pub.publicUrl }).eq("id", p.id);
  if (upd.error) { console.error(`  x db update failed ${p.name}: ${upd.error.message}`); continue; }

  uploaded++;
  if (uploaded % 25 === 0) console.log(`  ...${uploaded} uploaded`);
}

console.log(`\nDone. Uploaded ${uploaded}, already remote ${skipped}, missing/no image ${missing}.`);
