// Firebase Storage Diagnostic - REST API first
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7ajoEpm2aE-QfG2rd2hLthIdpNLsgd6A",
  authDomain: "giaovien40-b080f.firebaseapp.com",
  projectId: "giaovien40-b080f",
  storageBucket: "giaovien40-b080f.firebasestorage.app",
};

const pdfBytes = new TextEncoder().encode('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\nxref\n0 2\n0000000000 65535 f\n0000000009 00000 n\ntrailer<</Size 2/Root 1 0 R>>\nstartxref\n70\n%%EOF');

const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];

async function runTest() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  console.log('\n=== FIREBASE STORAGE DIAGNOSTIC ===\n');
  console.log('Signing in...');
  const cred = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
  const idToken = await cred.user.getIdToken();
  console.log('✅ Signed in as:', cred.user.email, '| UID:', cred.user.uid);

  const BUCKET = 'giaovien40-b080f.firebasestorage.app';

  // TEST 1: Check if bucket exists (list objects)
  console.log('\n--- Test 1: Check bucket exists ---');
  try {
    const listResp = await fetch(
      `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o`,
      { headers: { 'Authorization': `Bearer ${idToken}` } }
    );
    console.log('   GET /o Status:', listResp.status, listResp.statusText);
    const listBody = await listResp.text();
    console.log('   Response:', listBody.substring(0, 300));
  } catch (e) {
    console.error('   Network error:', e.message);
  }

  // TEST 2: Upload via REST API
  console.log('\n--- Test 2: Upload via REST API ---');
  try {
    const uploadResp = await fetch(
      `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?uploadType=media&name=${encodeURIComponent('skkn/test/diag-' + Date.now() + '.pdf')}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/pdf',
        },
        body: pdfBytes
      }
    );
    console.log('   POST Status:', uploadResp.status, uploadResp.statusText);
    const uploadBody = await uploadResp.text();
    console.log('   Response:', uploadBody.substring(0, 500));
    if (uploadResp.ok) console.log('\n✅ UPLOAD WORKS! The bucket and rules are fine.');
    else console.log('\n❌ Upload failed at REST level.');
  } catch (e) {
    console.error('   Network error:', e.message);
  }

  setTimeout(() => process.exit(0), 500);
}

runTest().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
