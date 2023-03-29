import admin, { auth } from "firebase-admin";
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

export const verifyAuthToken = async (token: string) => {
  initializeFirebaseAdmin();
  const fbauth = auth();
  const decodedIdToken = await fbauth.verifyIdToken(token as string);
  return decodedIdToken;
}
