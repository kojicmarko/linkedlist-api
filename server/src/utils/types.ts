import { Comment, Post } from "@prisma/client";

export type UserDTO = {
  username: string;
  posts: Post[];
  comments: Comment[];
  createdAt: Date;
};
