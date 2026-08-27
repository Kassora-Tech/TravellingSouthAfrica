/**
 * One-off migration: renames the Service Provider category "Airlines" to
 * "Activities" on existing Firestore documents, so listings created before
 * the category rename aren't silently mis-categorized or hidden from
 * category filters.
 *
 * Checks both `service_providers` (approved/public listings) and
 * `service_providers_submissions` (pending listings), since a submission
 * can carry a stale category before it's ever approved.
 *
 * Safe by default: running the script with no flags only lists the
 * documents that would change. Nothing is written until you re-run it
 * with --confirm.
 *
 * Usage:
 *   npx tsx scripts/migrate-airlines-to-activities.ts            (dry run, lists matches)
 *   npx tsx scripts/migrate-airlines-to-activities.ts --confirm  (applies the update)
 *
 * Requires: service-account.json in the project root (git-ignored), or
 * Application Default Credentials - same as scripts/seed-firestore.ts.
 */
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const OLD_CATEGORY = 'Airlines';
const NEW_CATEGORY = 'Activities';
const COLLECTIONS = ['service_providers', 'service_providers_submissions'];

async function main() {
  const confirm = process.argv.includes('--confirm');

  console.log('Initializing Firebase Admin SDK...');
  const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log(`Loaded credentials for project: ${serviceAccount.project_id || 'unknown'}`);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    console.log(`No service-account.json found at: ${serviceAccountPath}`);
    console.log('Attempting connection via Application Default Credentials (ADC)...');
    try {
      admin.initializeApp();
    } catch (err: any) {
      console.error('Failed to initialize Admin SDK:', err.message);
      console.log('\n--- HOW TO CONFIGURE CREDENTIALS ---');
      console.log('1. Go to Firebase Console -> Project Settings -> Service Accounts.');
      console.log('2. Click "Generate new private key" to download the JSON file.');
      console.log('3. Save it in the project root folder as "service-account.json".');
      console.log('4. Run this script again.\n');
      process.exit(1);
    }
  }

  const db = admin.firestore();
  console.log('Successfully connected to Firestore.\n');

  let totalMatches = 0;

  for (const collectionName of COLLECTIONS) {
    const snapshot = await db
      .collection(collectionName)
      .where('category', '==', OLD_CATEGORY)
      .get();

    if (snapshot.empty) {
      console.log(`[${collectionName}] No documents with category "${OLD_CATEGORY}".`);
      continue;
    }

    console.log(`[${collectionName}] ${snapshot.size} document(s) with category "${OLD_CATEGORY}":`);
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log(`  - ${doc.id}  |  name: ${data.name ?? 'N/A'}  |  townSlug: ${data.townSlug ?? 'N/A'}`);
    });
    totalMatches += snapshot.size;

    if (confirm) {
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { category: NEW_CATEGORY });
      });
      await batch.commit();
      console.log(`  -> Updated ${snapshot.size} document(s) in "${collectionName}" to category "${NEW_CATEGORY}".`);
    }
    console.log('');
  }

  if (totalMatches === 0) {
    console.log('Nothing to migrate.');
  } else if (!confirm) {
    console.log(`Dry run only - ${totalMatches} document(s) listed above would be updated.`);
    console.log('Re-run with --confirm to apply the change.');
  } else {
    console.log(`Done - ${totalMatches} document(s) updated to "${NEW_CATEGORY}".`);
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
