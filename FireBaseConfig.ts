import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyAySTNX5sBGsquwyOZkzAdKtlT4u9F-yZU",
  authDomain: "reactnativelicenta.firebaseapp.com",
  projectId: "reactnativelicenta",
  storageBucket: "reactnativelicenta.appspot.com",
  messagingSenderId: "744995321981",
  appId: "1:744995321981:web:e9dde8a30542d0ea0f9914",
  measurementId: "G-NSRHMREKPN"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const storage = getStorage(FIREBASE_APP);