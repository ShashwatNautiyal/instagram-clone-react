import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyCNjjSsJtXOPF2YpbZa40boMGjVwtG5GJY',
	authDomain: 'instagram-clone-840c6.firebaseapp.com',
	projectId: 'instagram-clone-840c6',
	storageBucket: 'instagram-clone-840c6.appspot.com',
	messagingSenderId: '84151489050',
	appId: '1:84151489050:web:9afcfbc2c00b2beaab77a3',
	measurementId: 'G-NE8NGV2YB1',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
