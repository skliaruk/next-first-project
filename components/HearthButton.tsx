import {
  collection,
  deleteDoc,
  doc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../lib/firebase";

const HeartButton = ({ postRef }) => {
  const heartRef = doc(postRef, "hearts", auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;

    await updateDoc(postRef, { heartCount: increment(1) });
    await setDoc(heartRef, { uid });
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    await updateDoc(postRef, { heartCount: increment(-1) });
    await deleteDoc(heartRef);
  };

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
};

export default HeartButton;
