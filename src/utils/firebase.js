import firebase from 'firebase/app'
import 'firebase/analytics'
import('firebase/functions')

const firebaseConfig = {
  apiKey: 'AIzaSyA51BLmKxwBXbPCUpsYAXUTku7SOQEwj54', // don't care about using env vars for this because it will show up in the web site anyway
  authDomain: 'nftpaywall.firebaseapp.com',
  projectId: 'nftpaywall',
  storageBucket: 'nftpaywall.appspot.com',
  messagingSenderId: '192760215835',
  appId: '1:192760215835:web:aba70b69db9bad6641bbbe',
  measurementId: 'G-EDT420QM09'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

export default firebase
