const admin = require("firebase-admin");

function initAdmin() {
  if (admin.apps.length) return admin;

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("Falta FIREBASE_SERVICE_ACCOUNT en .env");
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin;
}

const adminApp = initAdmin();

module.exports = {
  admin,
  db: adminApp.firestore(),
  authAdmin: adminApp.auth(),
};
