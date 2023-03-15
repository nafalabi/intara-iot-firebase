import admin from "firebase-admin";
import serviceAccount from "../../firebase-service-account.json";

export const initializeFirebaseAdmin = () => {
  if (admin.apps.length !== 0) return admin.app();
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
    databaseURL:
      "https://intara-47-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
};
