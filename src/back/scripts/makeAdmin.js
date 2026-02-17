require("dotenv").config();
const admin = require("firebase-admin");

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("❌ Falta FIREBASE_SERVICE_ACCOUNT en .env");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 👇 Pega tu UID aquí
const UID = "LyATWm5OSgONXORruiaUlTBcxaA2";

async function run() {
  await admin.auth().setCustomUserClaims(UID, { admin: true });
  console.log("✅ Listo. Usuario marcado como ADMIN:", UID);
  process.exit(0);
}

run().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});