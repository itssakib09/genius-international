import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD5b_VqM12_b-MX06rOFzOMYFnElgDZvYE",
  authDomain: "genius-international.firebaseapp.com",
  projectId: "genius-international",
  storageBucket: "genius-international.firebasestorage.app",
  messagingSenderId: "1032829624606",
  appId: "1:1032829624606:web:11f062f7db316614bb290f",
  measurementId: "G-Y6V8HCVK5R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };