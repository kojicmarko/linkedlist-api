import { Comment, Post } from "@prisma/client";

// https://stackoverflow.com/questions/65108033/property-user-does-not-exist-on-type-session-partialsessiondata
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

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

export interface UserLogin {
  email: string;
  password: string;
}
