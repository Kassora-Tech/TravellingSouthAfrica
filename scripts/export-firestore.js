/**
 * Read-only export of all root Firestore collections to /exports.
 * Produces one JSON file (full fidelity) and one CSV file (flattened) per collection.
 *
 * Usage: node scripts/export-firestore.js
 * Requires: service-account.json in the project root (git-ignored).
 *
 * This script performs NO writes to Firestore.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '..', 'service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const EXPORT_DIR = path.join(__dirname, '..', 'exports');

function serializeValue(value) {
  if (value === null || value === undefined) return value;
  if (value instanceof admin.firestore.Timestamp) return value.toDate().toISOString();
  if (value instanceof admin.firestore.GeoPoint) return { latitude: value.latitude, longitude: value.longitude };
  if (value instanceof admin.firestore.DocumentReference) return value.path;
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = serializeValue(v);
    return out;
  }
  return value;
}

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out);
    } else if (Array.isArray(v)) {
      out[key] = JSON.stringify(v);
    } else {
      out[key] = v;
    }
  }
  return out;
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function toCsv(rows) {
  const headerSet = new Set(['id']);
  const flatRows = rows.map((r) => flatten(r));
  for (const row of flatRows) for (const key of Object.keys(row)) headerSet.add(key);
  const headers = Array.from(headerSet);
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of flatRows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(','));
  }
  // UTF-8 BOM so Excel opens it correctly
  return '﻿' + lines.join('\r\n');
}

async function main() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });

  const collections = await db.listCollections();
  const summary = [];

  for (const col of collections) {
    const snapshot = await col.get();
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...serializeValue(doc.data()) }));

    const jsonPath = path.join(EXPORT_DIR, `${col.id}.json`);
    const csvPath = path.join(EXPORT_DIR, `${col.id}.csv`);
    fs.writeFileSync(jsonPath, JSON.stringify(docs, null, 2), 'utf8');
    fs.writeFileSync(csvPath, toCsv(docs), 'utf8');

    summary.push({ collection: col.id, documents: docs.length });
    console.log(`Exported ${col.id}: ${docs.length} documents`);
  }

  fs.writeFileSync(
    path.join(EXPORT_DIR, '_export-summary.json'),
    JSON.stringify({ exportedAt: new Date().toISOString(), collections: summary }, null, 2),
    'utf8'
  );

  console.log('\nDone. Files written to /exports');
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
