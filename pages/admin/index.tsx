import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import kebabCase from "lodash.kebabcase";

import { ref } from "firebase/storage";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCkeck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { auth, firestore } from "../../lib/firebase";
import { Post } from "../../lib/types";
import toast from "react-hot-toast";

const AdminPanel: React.FC = () => {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
};

const PostList = () => {
  // ref to nested collection in the user:
  const postsInUserRef = collection(
    firestore,
    `users/${auth.currentUser.uid}/posts`
  );

  // order / limit etc them:
  const q = query(postsInUserRef, orderBy("createdAt"));

  const [querySnapshot] = useCollection(q);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
};

const CreateNewPost = () => {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();

    const uid = auth.currentUser.uid;
    const ref = doc(firestore, `users/${auth.currentUser.uid}/posts`, slug);

    const data: Post = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: `hello ${username}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success("Post created!");

    router.push(`/admin/${slug}`);
  };
  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
};

export default AdminPanel;
