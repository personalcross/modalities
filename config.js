const firebaseConfig = {
    apiKey: data['apiKey'],
    authDomain: data['authDomain'],
    projectId: data['projectId'],
    storageBucket: data['storageBucket'],
    messagingSenderId: data['messagingSenderId'],
    appId: data["appId"],
    measurementId: data["measurementId"]
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
