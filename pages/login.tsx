import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { doc, getDoc } from "@firebase/firestore";
import debounce from "lodash.debounce";
import { collection, setDoc } from "firebase/firestore";

export default function Login({}) {
  const { user, username } = useContext(UserContext);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <Image alt="google-image" src={"/google.png"} width={24} height={24} />{" "}
      Sign In with Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}> Sign Out</button>;
}

function UsernameForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (val.length < 3) {
      setFormValue(val);
      setIsValid(false);
      setIsLoading(false);
    }
    if (re.test(val)) {
      setFormValue(val);
      setIsValid(false);
      setIsLoading(true);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        try {
          const ref = doc(firestore, "usernames", username);
          const docSnap = await getDoc(ref);
          if (docSnap.exists()) {
            setIsValid(false);
            setIsLoading(false);
          } else {
            setIsValid(true);
            setIsLoading(false);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const userDoc = doc(firestore, "users", user.uid);
    const usernameDoc = doc(firestore, "usernames", formValue);
    await setDoc(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    await setDoc(usernameDoc, { uid: user.uid });
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={isLoading}
          />
          <button type="submit" disabled={!isValid}>
            Choose
          </button>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
