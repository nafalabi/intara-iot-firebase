import firebase from "firebase/app";
import "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries
import firebaseConfig from "../../firebase-client-config.json";

export const initializeFirebaseClient = () => {
  if (firebase.apps.length > 0) return;
  const app = firebase.initializeApp(firebaseConfig);
  const analytics = firebase.analytics(app);
  return { app, analytics };
};
