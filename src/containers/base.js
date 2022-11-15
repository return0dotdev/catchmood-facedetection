import firebase from 'firebase/app'
import 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyAPi7A5ZpiZzVBdtLgOPiyhV6hQCi_o_2Q",
    authDomain: "catmood-f6a24.firebaseapp.com",
    databaseURL: "https://catmood-f6a24.firebaseio.com",
    projectId: "catmood-f6a24",
    storageBucket: "catmood-f6a24.appspot.com",
    messagingSenderId: "1082970009898",
    appId: "1:1082970009898:web:6373a330c4f13517352e53"
  };
  // Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);