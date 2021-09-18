import './App.css';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// import 'firebase/analytics';
import firebase from 'firebase/compat/app';
import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyDPBhPLGSAb7b5fA5C69lWLgUHswBpcy3M',
  authDomain: 'superchat-d0e88.firebaseapp.com',
  projectId: 'superchat-d0e88',
  storageBucket: 'superchat-d0e88.appspot.com',
  messagingSenderId: '474106190957',
  appId: '1:474106190957:web:be7a3c4670e17c23be3364',
  measurementId: 'G-M7HNVKKS85',
});

const auth = firebase.auth();
const firestore = firebase.firestore();
// eslint-disable-next-line no-unused-vars
// const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);
  console.log(user);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬 </h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button className="sign-in" onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
}
function SignOut() {
  return auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const userMessage = formValue;
    setFormValue('');
    if (auth.currentUser !== null) {
      const { uid, photoURL } = auth.currentUser;

      await messagesRef.add({
        text: userMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      });
    }

    if (dummy.current !== null) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <main>
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser?.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
          alt={auth.currentUser?.uid || 'hi'}
        />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
