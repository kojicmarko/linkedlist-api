import {
  CommentEntry,
  PostEntry,
  UserEntry,
  UserLogin,
} from "../src/utils/types";

export const existingUser: UserEntry = {
  email: "existing@testmail.com",
  username: "existing",
  password: "existing",
};

export const validUser: UserLogin = {
  email: "existing@testmail.com",
  password: "existing",
};

export const invalidUser: UserLogin = {
  email: "existing@testmail.com",
  password: "invalid",
};

export const newUser: UserEntry = {
  email: "testing@testmail.com",
  username: "testing",
  password: "testing",
};

export const validPost: PostEntry = {
  title: "Test Post",
  content: "This is a test post.",
};

export const invalidPost = {
  random: "title",
  invalid: "content",
};

export const validComment: CommentEntry = {
  content: "This is a test comment.",
};

// Should be temporary
export type TestHeader = {
  "x-powered-by": string;
  "content-type": string;
  "content-length": string;
  etag: string;
  "set-cookie": string[];
  date: string;
  connection: string;
};
