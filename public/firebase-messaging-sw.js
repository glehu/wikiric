// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

// eslint-disable-next-line no-undef
firebase.initializeApp({
  apiKey: 'AIzaSyDMz_cfwofnEW7d49795IhtOBZgmrJtyqA',
  authDomain: 'wikiric-bcd62.firebaseapp.com',
  projectId: 'wikiric-bcd62',
  storageBucket: 'wikiric-bcd62.appspot.com',
  messagingSenderId: '1096845773501',
  appId: '1:1096845773501:web:08c1e315c26ea9401685d4',
  measurementId: 'G-4ECZ10SYLF'
})

// eslint-disable-next-line no-undef,no-unused-vars
const messaging = firebase.messaging()
