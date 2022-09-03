import { User } from "firebase/auth";
import {
  query,
  getDocs,
  limit,
  orderBy,
  where,
  collection,
  collectionGroup,
} from "firebase/firestore";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import {
  firestore,
  getUserWithUsername,
  postsCol,
  postToJSON,
} from "../../lib/firebase";

export async function getServerSideProps(context) {
  const { username } = context.query;

  const userDoc = await getUserWithUsername(username);
  if (!userDoc) {
    return {
      notFound: true,
    };
  }
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const q = query(
      collectionGroup(firestore, "posts"),
      where("username", "==", username),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    posts = (await getDocs(q)).docs.map((doc) => postToJSON(doc));
  }

  return { props: { user, posts } };
}
const UserProfilePage: React.FC<{ user: any; posts: any }> = ({
  user,
  posts,
}) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  );
};

export default UserProfilePage;
