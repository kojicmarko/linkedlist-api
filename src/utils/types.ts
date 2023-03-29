import { Comment, PostLike, CommentLike, Post } from "@prisma/client";

// https://stackoverflow.com/questions/65108033/property-user-does-not-exist-on-type-session-partialsessiondata
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export type UserDTO = {
  username: string;
  posts: UserPost[];
  comments: Comment[];
  postLikes: PostLike[];
  commentLikes: CommentLike[];
  createdAt: Date;
};

export type UserPost = Omit<Post, "id" | "content" | "authorId">;

export interface UserEntry {
  email: string;
  username: string;
  password: string;
}

export interface UserEntryPersistance {
  email: string;
  username: string;
  passwordHash: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export type PostDTO = {
  title: string;
  content: string;
  comments: Comment[];
  author: string;
  postLikes: PostLike[];
  createdAt: Date;
  updatedAt: Date;
};

export interface PostEntry {
  title: string;
  content: string;
}
