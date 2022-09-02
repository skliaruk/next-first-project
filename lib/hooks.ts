import { collection, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      const ref = collection(firestore, "users");
      unsubscribe = getDoc(doc(ref, user.uid)).then((doc) => {
        if (doc.exists()) {
          setUsername(doc.data().username);
        } else {
          setUsername(null);
        }
      });
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
