import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCkeck";
import HeartButton from "../../components/HearthButton";
import PostContent from "../../components/PostContent";

import {
  auth,
  firestore,
  getUserWithUsername,
  postsCol,
  postToJSON,
} from "../../lib/firebase";
import { Post } from "../../lib/types";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path: string;
  if (userDoc) {
    const ref = doc(firestore, `users/${userDoc.id}/posts`, slug);
    const docRef = await getDoc(ref);
    console.log(userDoc);
    console.log(docRef);
    post = postToJSON(docRef);
    path = ref.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const q = query(collectionGroup(firestore, "posts"));
  const paths = (await getDocs(q)).docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}
export default function PostPage(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0}</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/login">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
}
