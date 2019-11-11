import React from 'react';
import * as firebase from 'firebase';
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Img from 'react-image'


const config = {
    apiKey: "AIzaSyCg4kjjppXHdL2NlgvYVSwUITRip6Uuq68",
    authDomain: "notes-react-7aad5.firebaseapp.com",
    databaseURL: "https://notes-react-7aad5.firebaseio.com",
    projectId: "notes-react-7aad5",
    storageBucket: "notes-react-7aad5.appspot.com",
    messagingSenderId: "745029342191",
    appId: "1:745029342191:web:69ac6c2b5138af0daedc1a",
    measurementId: "G-YHYJZZ5MHN"
};

firebase.initializeApp(config);
// firebase.analytics();


// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/notes-react',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ]
  };

export const Logo = () => (
    <Img style={{ maxWidth: 500 }} src={'https://cdn4.iconfinder.com/data/icons/office-55/256/4-512.png'} />
  )  
  
export const SignIn = class SignInScreen extends React.Component {
    render() {
      return (
        <div>
            <Logo/>
          <p>You need to sign-in</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
  }

export default firebase;

