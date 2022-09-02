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
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";

import {
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
    const q = doc(firestore, "posts", slug);
    const docRef = await getDoc(q);
    post = postToJSON(await docRef.data());
    path = q.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

// eslint-disable-next-line @next/next/no-typos
export async function getStaticPath() {
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
  const postRef = doc(props.path);
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
      </aside>
    </main>
  );
}
