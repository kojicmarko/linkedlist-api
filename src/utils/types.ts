import { Comment, Post } from "@prisma/client";

export type UserDTO = {
  username: string;
  posts: Post[];
  comments: Comment[];
  createdAt: Date;
};

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
