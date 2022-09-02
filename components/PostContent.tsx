import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Post } from "../lib/types";

const PostContent: React.FC<{ post: Post }> = ({ post }) => {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt;

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${post.username}`}>
          <a className="text-info"> @{post.username}</a>
        </Link>{" "}
        on {(createdAt as Date).toISOString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
};

export default PostContent;
