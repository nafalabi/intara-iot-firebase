import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries
import firebaseConfig from "../../firebase-client-config.json";

export const initializeFirebaseClient = () => {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
	return { app, analytics };
};
