import { Timestamp } from "@firebase/firestore";
export type Post = {
  content: string;
  heartCount: number;
  published: boolean;
  slug: string;
  title: string;
  uid: string;
  username: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
